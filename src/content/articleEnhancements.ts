import type { ContentPage } from "./types";

type ArticleEnhancement = {
  sections: ContentPage["sections"];
  faqs: NonNullable<ContentPage["faqs"]>;
};

export const articleEnhancements: Record<string, ArticleEnhancement> = {
  "/blog/round-vs-oval-face/": {
    sections: [
      { heading: "Use the cheeks as a checkpoint, not the answer", paragraphs: ["Full cheeks can make an oval face look round in one photo, especially when you smile. The useful question is whether that fullness continues into a soft, compact outline or sits inside a face that still has visible length below the cheeks.", "Trace the sides from the temples through the cheeks to the chin. A round outline usually stays curved throughout. An oval outline can have rounded cheeks too, but it keeps more vertical distance and tapers below the widest point."], },
      { heading: "A mirror test that avoids over-measuring", bullets: ["Stand at arm's length from a mirror in even daylight and relax your expression.", "Cover the lower third of your face briefly. If the remaining outline still feels compact and circular, round remains plausible.", "Uncover the jaw and chin. Extra length and a gradual lower taper point more strongly toward oval.", "Check a straight photo afterward. The [manual face-shape guide](/how-to-find-your-face-shape/) explains how to keep the camera view consistent."], },
      { heading: "What to do when both labels fit", paragraphs: ["Round-oval is a useful description when your face is only a little longer than it is wide and the jaw stays soft. You do not need to settle an argument with a ruler. Use the round principle when you want more vertical direction, or the oval principle when you want to preserve a balanced, natural outline.", "Facial measurements vary among people and populations, which is one reason broad visual categories should stay flexible. [Facial anthropometry research indexed by the National Library of Medicine](https://pmc.ncbi.nlm.nih.gov/articles/PMC8783922/) is useful context for why a single universal ratio is not a reliable personal verdict."], },
    ],
    faqs: [
      { question: "Can an oval face have very full cheeks?", answer: "Yes. Cheek fullness does not cancel out oval proportions. Check whether face length and the taper below the cheeks remain more noticeable than on a round outline." },
      { question: "Does a centre part make an oval face look rounder?", answer: "It can make symmetry and cheek width more noticeable, but it does not change the underlying outline. Compare with hair moved away before deciding on a face-shape label." },
    ],
  },
  "/blog/oval-vs-oblong-face/": {
    sections: [
      { heading: "Look for side shape before chasing a ratio", paragraphs: ["Oval and oblong faces can both be longer than wide, so a length-to-width comparison alone often leaves people stuck. The side outline is more revealing: oval usually rounds outward around the cheeks before tapering, while oblong often reads straighter for a longer distance.", "Do not treat a small difference as proof. The goal is to notice the overall rhythm of the outline: curved and balanced, or vertically led with more parallel sides."], },
      { heading: "Separate facial length from hair length", paragraphs: ["Tall hair, a high bun, or a cropped forehead can make any face look longer. For identification, reveal the temples and jaw, keep the whole chin in frame, and judge the facial boundary rather than the hairstyle.", "For styling, bring the hair back into the decision. A fringe, side width, and deeper lenses can reduce vertical emphasis; height at the crown and sleek sides can strengthen it. The [hairstyle principles guide](/hairstyles-by-face-shape/) explains these visual choices without treating them as rules."], },
      { heading: "A practical styling decision", paragraphs: ["If your face feels oval, choose a style for the mood you want rather than trying to correct length. If it feels oblong, ask whether you want more horizontal presence: soft side volume, a fringe, or frames with more lens depth can change the perceived balance.", "Eyewear still has to fit. Frame width, bridge stability, prescription needs, and temple comfort matter more than a face-shape label; the [National Eye Institute's eyeglass guidance](https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/refractive-errors/eyeglasses-refractive-errors) is a useful reminder to start with eye care and fit."], },
    ],
    faqs: [
      { question: "Can an oblong face have a rounded chin?", answer: "Yes. Oblong is mainly a length-and-side-outline pattern. A chin can be rounded, softly tapered, or broader without changing the stronger vertical impression." },
      { question: "Are rectangle and oblong the same face shape?", answer: "They are often used loosely for a long face, but rectangle usually suggests a more angular jaw and forehead. Compare the jaw corners as well as length before choosing a description." },
    ],
  },
  "/blog/why-face-shape-results-change-between-photos/": {
    sections: [
      { heading: "Perspective is the hidden variable", paragraphs: ["Two photos of the same face can disagree even when neither is edited. A close lens changes the relationship between nearer and farther features, while a more distant camera position produces a less exaggerated view. That is perspective, not your face changing between Tuesday and Thursday.", "Research on facial-image acquisition has found that focal length can affect depicted shape and proportion. [This PubMed-indexed study](https://pubmed.ncbi.nlm.nih.gov/26894832/) is a useful reminder that camera setup matters when a result depends on visible proportions."], },
      { heading: "Build one repeatable photo routine", bullets: ["Use the same room or similarly even front light when you compare results.", "Place the camera at eye height and keep your head level rather than lifting your chin to the lens.", "Stand several feet away and crop later instead of taking a close wide-angle selfie.", "Use a neutral expression, with hair and accessories off the facial outline.", "Save nothing sensitive if you do not need it; the site's detector processes the selected image in your browser."], },
      { heading: "Treat a result as a comparison, not a diagnosis", paragraphs: ["A photo can be a helpful way to compare an outline, but it cannot settle questions about bone structure, dental alignment, or facial asymmetry. If something about your face has changed suddenly or concerns you medically, a style guide is not the right tool.", "Standardized photographs can support selected facial measurements, but non-professional images have limits. A [2024 photoanthropometry study](https://pubmed.ncbi.nlm.nih.gov/39431727/) found that some indices differed between direct measurement and ordinary photographs, which supports using a controlled image and keeping conclusions modest."], },
    ],
    faqs: [
      { question: "Should I use the front or back camera for face shape?", answer: "Use whichever camera lets you stand farther away, keep the lens at eye height, and take a straight, well-lit image. Consistent distance and pose matter more than the camera label." },
      { question: "Why does a selfie make my jaw look different?", answer: "A close selfie changes perspective and may enlarge nearer features while reducing the apparent width of others. Move the camera back and crop the result for a more consistent comparison." },
    ],
  },
  "/blog/can-you-have-more-than-one-face-shape/": {
    sections: [
      { heading: "Think in features before categories", paragraphs: ["A category is a shorthand for a pattern, not a diagnosis stamped on your face. You may have oval-like length, a heart-like taper, and cheekbones that become more noticeable in certain light. Those observations can all be true at once.", "Start by naming the feature you actually see: extra length, a broad jaw, a cheekbone peak, a wider upper face, or a narrow chin. That is more useful than trying to make one label carry every detail."], },
      { heading: "How to use a primary and secondary match", paragraphs: ["Choose a primary match from the feature that organizes the whole outline, then use a secondary match only where it adds practical information. For example, an oval-oblong mix may use oval as its baseline but borrow oblong ideas when a style adds too much vertical height.", "This approach also prevents a common mistake: copying every recommendation from two categories at once. Pick one visual goal, such as more jaw-level width or less crown height, and test that one change."], },
      { heading: "When a mixed result is mostly a photo problem", paragraphs: ["If your two closest matches change wildly from one image to the next, fix the photo before treating the result as a personal mystery. Hidden temples, facial hair, a tilted head, and a close lens can all shift where the outline appears widest.", "The [photo consistency guide](/blog/why-face-shape-results-change-between-photos/) gives a repeatable setup. Measurements themselves also vary across people and populations, as shown in [facial anthropometry research](https://pubmed.ncbi.nlm.nih.gov/24293927/), so a close call is normal rather than a failure."], },
    ],
    faqs: [
      { question: "Should I buy products for both face shapes?", answer: "No. Use face shape as a flexible styling reference, then choose a hairstyle or frame based on fit, comfort, texture, maintenance, and the feature you want to emphasize." },
      { question: "Can an app give two different face-shape answers?", answer: "Yes. Categories overlap, and image conditions can change visible proportions. A close primary and secondary result is often more honest than a forced single label." },
    ],
  },
  "/blog/heart-vs-diamond-face/": {
    sections: [
      { heading: "Map the widest point with two simple comparisons", paragraphs: ["First compare the upper face with the cheekbones. Then compare the cheekbones with the jaw. A heart outline is broadest higher on the face and narrows downward; a diamond outline has a clearer middle peak, then narrows both toward the temples and jaw.", "This is easier in soft front light than in a dramatic portrait. Strong side light can make the near cheek look wider and turn a balanced face into a temporary diamond on camera."], },
      { heading: "A styling example without rigid rules", paragraphs: ["Suppose your cheekbones are the feature you notice first. You might try temple volume, a frame with upper-corner interest, or jaw-level movement in hair. If the upper face feels broader instead, you might prefer lower-face softness or a lighter-looking brow line.", "The point is to respond to the feature, not to follow a mandatory category. The [glasses guide](/glasses-by-face-shape/) and [hairstyle guide](/hairstyles-by-face-shape/) explain how contrast and harmony create different effects."], },
      { heading: "Check the result in an unstyled view", paragraphs: ["Hair volume at the temples can make a diamond outline look heart-like, while contour makeup or side lighting can create a cheekbone peak that is not visible in even light. Pull hair back gently, remove large accessories, and use a neutral expression before comparing.", "Photographic facial analysis is most useful when landmarks and camera conditions are consistent. [Research on facial photographs](https://pubmed.ncbi.nlm.nih.gov/39431727/) supports treating an ordinary image as a helpful reference, not an exact substitute for direct measurement."], },
    ],
    faqs: [
      { question: "Can a diamond face have a wide forehead?", answer: "It can, but a diamond pattern is clearest when cheekbones still form the strongest visible width and the upper face recedes relative to them." },
      { question: "Can a heart face have high cheekbones?", answer: "Yes. Check whether the upper face matches or exceeds that cheek width. High cheekbones alone do not make a face diamond." },
    ],
  },
  "/blog/round-vs-square-face/": {
    sections: [
      { heading: "Read the transition at the jaw corner", paragraphs: ["The useful difference is not whether a jaw is visible. Almost every face has a jaw. Look for how the side of the face changes direction as it reaches the lower corner: round continues through an arc, while square holds width and turns more distinctly.", "Try tracing each side in a mirror with your finger held just outside the skin. This keeps your attention on the whole lower outline instead of one highlighted shadow."], },
      { heading: "How facial hair and expression can confuse the comparison", paragraphs: ["A beard can add or hide width at the jaw, and a smile can lift the cheeks enough to soften a square pattern. Check the natural edge with a relaxed expression when possible, then treat covered areas as uncertain rather than guessing.", "For styling, that uncertainty is not a problem. You can use a beard, haircut, or frame to emphasize structure or add softness based on the look you prefer."], },
      { heading: "Choose frames for fit and effect", paragraphs: ["Round or oval frames can contrast with a structured jaw; rectangles can reinforce it. On a round outline, angular or upswept frames can introduce definition, while round frames create a more harmonious effect. Both are style choices, not prescriptions.", "For prescription glasses, begin with eye care and physical fit. The [National Eye Institute explains the role of eye exams and opticians](https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/refractive-errors/eyeglasses-refractive-errors), which matters more than a frame-shape rule."], },
    ],
    faqs: [
      { question: "Can a round face have a strong chin?", answer: "Yes. A chin can be defined without creating a square pattern. Check whether the sides and jaw still flow through a curve rather than holding broad width and visible corners." },
      { question: "Does a beard make a face square?", answer: "It can change the visible silhouette, especially at the jaw. Compare the natural lower outline where possible and use facial hair as a styling choice rather than a face-shape test." },
    ],
  },
  "/blog/does-face-shape-change-with-age/": {
    sections: [
      { heading: "Why the same face can look different over time", paragraphs: ["A face is not a flat outline. Skin, fat pads, muscle activity, hair, facial hair, posture, lighting, and camera technology all affect what you see in a photograph. Changes in those layers can make cheekbones, jaw corners, or temples appear more or less prominent.", "Reviews of facial ageing describe changes in soft tissue and supporting structures over time, but they do not turn informal face-shape categories into medical diagnoses. [This PubMed-indexed review](https://pubmed.ncbi.nlm.nih.gov/30581032/) is useful background for why a visible outline can evolve."], },
      { heading: "Compare like with like", bullets: ["Use images taken at a similar distance, angle, and focal length before comparing years.", "Keep hairstyle, facial hair, and expression in mind; these can have a bigger visual effect than a small change in facial fullness.", "Avoid judging one old low-resolution photo against a modern close selfie.", "Describe what changed visually, such as softer jaw visibility, before assigning a new label."], },
      { heading: "When not to use a style article as reassurance", paragraphs: ["A face-shape guide is for informal appearance and styling questions. It cannot assess sudden swelling, pain, an injury, a new asymmetry, or a dental or skin concern. Those deserve advice from an appropriately qualified health professional.", "For ordinary styling, reassess with the [manual guide](/how-to-find-your-face-shape/) and use the feature you see now. You are allowed to change a haircut or frame preference without first proving that your category changed."], },
    ],
    faqs: [
      { question: "Can weight change make my face look rounder or more angular?", answer: "Changes in facial fullness can alter how cheeks and jaw contours appear. It does not mean there is one predictable direction for everyone, so describe the visible change rather than assuming a new fixed face shape." },
      { question: "Why do old photos make my face look different?", answer: "Photo distance, lens, lighting, expression, hairstyle, and image quality can all change the apparent outline. Compare controlled images before deciding that your structure changed." },
    ],
  },
  "/blog/phone-camera-distortion-face-shape/": {
    sections: [
      { heading: "Distance changes perspective even with the same phone", paragraphs: ["A phone close to the face does not simply make a smaller version of the same picture. It changes perspective: nearer areas can appear larger relative to areas farther from the lens. Moving back and cropping is usually the simplest way to make a comparison photo more consistent.", "Focal length and acquisition setup can alter depicted facial shape, as discussed in [this PubMed-indexed study](https://pubmed.ncbi.nlm.nih.gov/26894832/). That is why the goal is a repeatable camera routine, not finding a magic device."], },
      { heading: "A quick setup for a usable comparison photo", bullets: ["Wipe the lens and turn off beauty, reshaping, or portrait filters.", "Set the phone at eye level on a shelf, tripod, or stable support.", "Step back several feet, keep your face centred, and leave space around the chin and hairline.", "Use soft light from in front, then take two neutral photos instead of one hurried selfie.", "Crop after capture if you need a closer view."], },
      { heading: "What a better photo can and cannot do", paragraphs: ["A controlled photo makes it easier to compare visible proportions, but it still cannot diagnose jaw position, skeletal structure, or a medical condition. Use it as an informal visual reference and keep close matches open.", "A recent [photoanthropometry study](https://pubmed.ncbi.nlm.nih.gov/39431727/) found that some measurements from non-professional photographs differed from direct measurement. That supports the practical approach here: standardize the photo, compare patterns, and avoid false precision."], },
    ],
    faqs: [
      { question: "Does switching from front to back camera fix distortion?", answer: "Not by itself. The key is camera distance, eye-level position, and a straight pose. Use the camera that lets you control those conditions most easily." },
      { question: "Should I use portrait mode for face shape analysis?", answer: "No. Use a plain, unfiltered photo. Blur and beauty effects can hide facial boundaries or alter the visual relationships you are trying to compare." },
    ],
  },
  "/blog/face-shape-measurement-mistakes/": {
    sections: [
      { heading: "Turn four rough measurements into a useful pattern", paragraphs: ["Face length, upper-face width, cheekbone width, and jaw width are not four separate quizzes. Read them together. A longer length matters differently on a curved oval outline than on straighter oblong sides; a broad jaw matters differently when the upper face is equally broad than when it is much narrower.", "Use a measurement only when you can identify the same visible boundary on both sides. If hair, a beard, or uneven light hides the edge, mark that observation as uncertain instead of inventing precision."], },
      { heading: "A two-photo cross-check", paragraphs: ["After measuring in a mirror, compare one controlled front photo. The mirror lets you adjust your pose; the photo makes it easier to step back and compare left and right sides. If the two views disagree, repeat the setup before adding more numbers.", "Photographic measurements can be informative, but setup matters. [Research on non-professional facial photographs](https://pubmed.ncbi.nlm.nih.gov/39431727/) found that not every photographed index matched direct measurement, which is why this guide uses broad relationships rather than exact thresholds."], },
      { heading: "Know when to stop measuring", paragraphs: ["If your measurements differ by a few millimetres or one photo suggests oval while another suggests heart, you have reached the limit of a home comparison. Switch from numbers to visible features: where is the face widest, how does the jaw taper, and how much does length stand out?", "The [seven face-shape overview](/face-shapes/) helps turn those observations into a practical starting point. More measuring is not automatically more accurate."], },
    ],
    faqs: [
      { question: "Should I measure around the curve of my jaw?", answer: "For a simple face-shape comparison, use the visible horizontal span between jaw corners rather than tracing the entire curved jawline. Keep the method consistent across all widths." },
      { question: "What if the left and right side of my face look different?", answer: "Small asymmetry is common. Use the overall outline in a straight photo, avoid treating one side as the entire answer, and do not use a face-shape guide to assess a medical concern." },
    ],
  },
  "/blog/how-hairstyles-change-face-shape/": {
    sections: [
      { heading: "Read the hairstyle as a second outline", paragraphs: ["Hair creates a silhouette around the face. Height at the crown extends the vertical line; width at the temples widens the upper face; fullness near the jaw changes the apparent lower balance. This is why the same cut can read differently on straight, wavy, curly, and coily hair.", "Before choosing a style, look at a reference photo and ask where its greatest volume sits. That one observation is more useful than a promise that a cut is universally flattering."], },
      { heading: "Match the plan to real hair, not a face-shape label", paragraphs: ["Texture, density, shrinkage, curl pattern, growth direction, hairline, current length, heat tolerance, and maintenance time affect whether a reference will translate. A stylist can adapt the same visual idea with different layers, perimeter weight, fringe density, or drying technique.", "Bring two reference images: one for the overall effect and one that resembles your hair texture. That gives a stylist better information than a single label such as oval or square."], },
      { heading: "Use an experiment instead of a rulebook", paragraphs: ["Try a temporary part, clip-in fringe, a change in where you place volume, or a different styling finish before committing to a major cut. Take a photo at eye level in ordinary light, then decide whether you like the effect.", "The [face-shape hub](/face-shapes/) can help you identify the feature you want to interact with, but personal comfort and hair health belong in the decision too. A hairstyle is allowed to be dramatic, quiet, practical, or simply fun."], },
    ],
    faqs: [
      { question: "Can layers make every face look slimmer?", answer: "No. Layers change movement and where volume collects; their effect depends on placement, texture, density, and styling. Choose them for the silhouette you want, not a guaranteed outcome." },
      { question: "Do I need to avoid a hairstyle because of my face shape?", answer: "No. Face shape is one visual input. Hair texture, condition, maintenance, culture, work needs, and personal preference are equally valid reasons to choose or avoid a style." },
    ],
  },
};
