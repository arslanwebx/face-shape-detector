"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { classifyFace, explainResult, QUALITY_THRESHOLDS, type ShapeName } from "@/lib/classifier";
import { measureLandmarks, poseQuality } from "@/lib/landmarks";

type Result = {
  matches: { shape: ShapeName; score: number }[];
  reasons: string[];
  note: string;
};

const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];

async function imageToCanvas(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, QUALITY_THRESHOLDS.maxAnalysisSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Your browser could not prepare this image.");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return { canvas, context };
}

function pixelQuality(context: CanvasRenderingContext2D, width: number, height: number) {
  const sampleWidth = Math.min(320, width);
  const sampleHeight = Math.max(1, Math.round((height / width) * sampleWidth));
  const sample = document.createElement("canvas");
  sample.width = sampleWidth;
  sample.height = sampleHeight;
  const sampleContext = sample.getContext("2d", { willReadFrequently: true })!;
  sampleContext.drawImage(context.canvas, 0, 0, sampleWidth, sampleHeight);
  const data = sampleContext.getImageData(0, 0, sampleWidth, sampleHeight).data;
  const gray = new Float32Array(sampleWidth * sampleHeight);
  let brightness = 0;
  for (let index = 0, pixel = 0; index < data.length; index += 4, pixel += 1) {
    const value = data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114;
    gray[pixel] = value;
    brightness += value;
  }
  brightness /= gray.length;
  let lapSum = 0;
  let lapSquared = 0;
  let count = 0;
  for (let y = 1; y < sampleHeight - 1; y += 1) {
    for (let x = 1; x < sampleWidth - 1; x += 1) {
      const i = y * sampleWidth + x;
      const lap = gray[i - 1] + gray[i + 1] + gray[i - sampleWidth] + gray[i + sampleWidth] - 4 * gray[i];
      lapSum += lap;
      lapSquared += lap * lap;
      count += 1;
    }
  }
  const mean = lapSum / Math.max(count, 1);
  return { brightness, blurVariance: lapSquared / Math.max(count, 1) - mean * mean };
}

export default function Detector() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Choose a photo to begin.");
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const clearImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview("");
    setFile(null);
    setResult(null);
    setError("");
    setStatus("Image removed. Choose another photo when ready.");
    if (uploadRef.current) uploadRef.current.value = "";
    if (cameraRef.current) cameraRef.current.value = "";
  };

  const chooseFile = (candidate?: File) => {
    if (!candidate) return;
    setError("");
    setResult(null);
    if (!acceptedTypes.includes(candidate.type)) {
      setError("Choose a JPEG, PNG, or WebP image.");
      return;
    }
    if (candidate.size > QUALITY_THRESHOLDS.maxFileBytes) {
      setError("This image is larger than 8 MB. Choose a smaller file.");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(candidate);
    setPreview(URL.createObjectURL(candidate));
    setStatus("Photo ready. Review it, then select Analyze photo.");
  };

  const analyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setResult(null);
    setError("");
    setStatus("Preparing the image locally in your browser.");
    try {
      const { canvas, context } = await imageToCanvas(file);
      const pixels = pixelQuality(context, canvas.width, canvas.height);
      if (pixels.brightness < QUALITY_THRESHOLDS.minBrightness) throw new Error("Use even lighting. This photo is too dark for a useful estimate.");
      if (pixels.brightness > QUALITY_THRESHOLDS.maxBrightness) throw new Error("Use even lighting. This photo is overexposed.");
      if (pixels.blurVariance < QUALITY_THRESHOLDS.minBlurVariance) throw new Error("Use a clearer photo. This image appears severely blurred.");

      setStatus("Loading the private browser analysis model.");
      const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
      const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
      const options = {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "IMAGE",
        numFaces: 2,
        minFaceDetectionConfidence: 0.55,
        minFacePresenceConfidence: 0.55,
        minTrackingConfidence: 0.5,
      } as const;
      let landmarker;
      try {
        landmarker = await FaceLandmarker.createFromOptions(vision, options);
      } catch {
        landmarker = await FaceLandmarker.createFromOptions(vision, {
          ...options,
          baseOptions: { modelAssetPath: options.baseOptions.modelAssetPath, delegate: "CPU" },
        });
      }
      setStatus("Checking face position and visible proportions.");
      const detection = landmarker.detect(canvas);
      landmarker.close();
      if (detection.faceLandmarks.length === 0) throw new Error("No face was detected. Use a clear, front-facing photo with your full face visible.");
      if (detection.faceLandmarks.length > 1) throw new Error("Only one person should appear in the photo.");
      const landmarks = detection.faceLandmarks[0];
      const pose = poseQuality(landmarks);
      if (pose.area < QUALITY_THRESHOLDS.minFaceArea) throw new Error("Move closer to the camera so your face fills more of the frame.");
      if (pose.roll > QUALITY_THRESHOLDS.maxRollDegrees) throw new Error("Keep your head straight. This photo has too much sideways tilt.");
      if (pose.yaw > QUALITY_THRESHOLDS.maxYawOffset) throw new Error("Face the camera directly. This photo appears turned to one side.");
      const measurements = measureLandmarks(landmarks);
      const matches = classifyFace(measurements);
      const primary = matches[0].shape;
      setResult({
        matches,
        reasons: explainResult(primary, measurements),
        note: "The face is large enough, approximately front-facing, reasonably level, and usable for this estimate. Check that hair, facial hair, a hat, sunglasses, a mask, or a hand did not hide the natural jaw or upper-face outline.",
      });
      setStatus(`Analysis complete. Your estimated face shape is ${primary.toLowerCase()}.`);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "The image could not be analyzed. Try a different photo.";
      setError(message);
      setStatus(`Analysis stopped. ${message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const downloadCard = () => {
    if (!result) return;
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fbf9ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#6d4aff";
    ctx.fillRect(0, 0, 22, canvas.height);
    ctx.fillStyle = "#1f2030";
    ctx.font = "600 30px Arial";
    ctx.fillText(siteConfig.brandName, 72, 78);
    ctx.font = "700 64px Arial";
    ctx.fillText(`Estimated shape: ${result.matches[0].shape}`, 72, 178);
    ctx.fillStyle = "#5f6072";
    ctx.font = "30px Arial";
    ctx.fillText("Similarity scores from one browser-processed photo", 72, 230);
    result.matches.slice(0, 3).forEach((match, index) => {
      const y = 312 + index * 76;
      ctx.fillStyle = "#1f2030";
      ctx.font = "600 28px Arial";
      ctx.fillText(match.shape, 72, y);
      ctx.fillStyle = "#ebe7fb";
      ctx.fillRect(250, y - 24, 650, 30);
      ctx.fillStyle = index === 0 ? "#6d4aff" : "#9a86e8";
      ctx.fillRect(250, y - 24, 650 * (match.score / 100), 30);
      ctx.fillStyle = "#1f2030";
      ctx.fillText(`${match.score}%`, 930, y);
    });
    ctx.fillStyle = "#5f6072";
    ctx.font = "24px Arial";
    ctx.fillText("Estimate only. Your photo is not included in this privacy-safe card.", 72, 575);
    const link = document.createElement("a");
    link.download = `${result.matches[0].shape.toLowerCase()}-face-shape-result.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const primary = result?.matches[0];
  return (
    <section id="detector" className="tool-shell" aria-labelledby="detector-title">
      <div className="tool-heading">
        <div>
          <p className="eyebrow">Private browser analysis</p>
          <h2 id="detector-title">Analyze a front-facing photo</h2>
        </div>
        <span className="privacy-chip">Photo not stored</span>
      </div>
      <p className="privacy-note"><strong>Your photo is processed privately in your browser and is not stored.</strong> The selected image and derived measurements are never sent to this website&apos;s server or analytics.</p>

      <div className="detector-grid">
        <div>
          {!preview ? (
            <div
              className={`dropzone ${dragging ? "is-dragging" : ""}`}
              onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => { event.preventDefault(); setDragging(false); chooseFile(event.dataTransfer.files[0]); }}
            >
              <div className="upload-icon" aria-hidden="true">↥</div>
              <h3>Drop a photo here</h3>
              <p>JPEG, PNG, or WebP, up to 8 MB</p>
              <div className="button-row">
                <button className="button" type="button" onClick={() => uploadRef.current?.click()}>Choose a photo</button>
                <button className="button secondary" type="button" onClick={() => cameraRef.current?.click()}>Use device camera</button>
              </div>
              <input ref={uploadRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => chooseFile(event.target.files?.[0])} />
              <input ref={cameraRef} className="sr-only" type="file" accept="image/*" capture="user" onChange={(event) => chooseFile(event.target.files?.[0])} />
            </div>
          ) : (
            <div className="preview-card">
              <div className="preview-image-wrap"><Image src={preview} alt="Selected photo preview for local face-shape analysis" fill unoptimized sizes="(max-width: 768px) 100vw, 50vw" /></div>
              <div className="button-row">
                <button className="button" type="button" onClick={analyze} disabled={analyzing}>{analyzing ? "Analyzing…" : "Analyze photo"}</button>
                <button className="button secondary" type="button" onClick={() => uploadRef.current?.click()} disabled={analyzing}>Replace</button>
                <button className="button secondary" type="button" onClick={() => cameraRef.current?.click()} disabled={analyzing}>Retake with camera</button>
                <button className="text-button" type="button" onClick={clearImage} disabled={analyzing}>Remove</button>
                <input ref={uploadRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => chooseFile(event.target.files?.[0])} />
                <input ref={cameraRef} className="sr-only" type="file" accept="image/*" capture="user" onChange={(event) => chooseFile(event.target.files?.[0])} />
              </div>
            </div>
          )}
          {error && <p className="error-message" role="alert">{error}</p>}
          <p className="sr-only" aria-live="polite">{status}</p>
        </div>

        <aside className="quality-card" aria-labelledby="quality-title">
          <h3 id="quality-title">For the clearest estimate</h3>
          <ul className="check-list">
            <li>Show one face, looking directly at the camera.</li>
            <li>Keep the camera at eye level and several feet away.</li>
            <li>Use even front light and a relaxed expression.</li>
            <li>Keep the full chin and visible upper face in frame.</li>
            <li>Pull hair away from the jaw and cheeks.</li>
            <li>Remove hats, sunglasses, masks, hands, and heavy filters.</li>
          </ul>
          <p className="small-copy">Camera access is requested only after you choose the camera option. You can also take a new camera photo to replace the current image.</p>
        </aside>
      </div>

      <div className="result-space" aria-live="polite">
        {result && primary && (
          <div className="result-card">
            <div className="result-topline"><p className="eyebrow">Your estimate</p><span>Scores total 100%</span></div>
            <h3>Your estimated face shape is {primary.shape.toLowerCase()}.</h3>
            <p>These are similarity scores for the visible proportions in this photo, not scientific accuracy or diagnostic confidence.</p>
            <div className="score-list">
              {result.matches.slice(0, 3).map((match, index) => (
                <div className="score-row" key={match.shape}>
                  <div><strong>{match.shape}</strong>{index > 0 && <span>Possible secondary match</span>}</div>
                  <div className="score-track" aria-hidden="true"><span style={{ width: `${match.score}%` }} /></div>
                  <b>{match.score}%</b>
                </div>
              ))}
            </div>
            <h4>Why {primary.shape.toLowerCase()} scored highest</h4>
            <ul className="check-list">{result.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
            <div className="quality-note"><strong>Photo-quality note:</strong> {result.note}</div>
            <div className="limitation"><strong>Important limitation:</strong> MediaPipe supplies landmarks, not a face-shape diagnosis. Categories overlap, and hairline, facial hair, expression, perspective, and hidden contours can change the estimate.</div>
            <div className="button-row">
              <Link className="button" href={`/face-shapes/${primary.shape.toLowerCase()}/`}>Read the {primary.shape.toLowerCase()} guide</Link>
              <button className="button secondary" type="button" onClick={downloadCard}>Download result card</button>
              <button className="text-button" type="button" onClick={clearImage}>Try another image</button>
            </div>
            <div className="result-links"><Link href="/hairstyles-by-face-shape/">Hairstyles by face shape</Link><Link href="/glasses-by-face-shape/">Glasses by face shape</Link></div>
          </div>
        )}
      </div>
    </section>
  );
}
