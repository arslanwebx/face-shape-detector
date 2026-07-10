export const shapes = [
  {
    slug: "oval",
    name: "Oval",
    image: "/faces/oval-face.svg",
    traits: ["Longer than it is wide", "Gently curved jaw", "Balanced upper and lower face"],
  },
  {
    slug: "round",
    name: "Round",
    image: "/faces/round-face.svg",
    traits: ["Length and width are relatively close", "Full-looking cheeks", "Soft jaw and chin"],
  },
  {
    slug: "square",
    name: "Square",
    image: "/faces/square-face.svg",
    traits: ["Similar length and width", "Broad jaw", "Clear jaw corners"],
  },
  {
    slug: "heart",
    name: "Heart",
    image: "/faces/heart-face.svg",
    traits: ["Upper face appears wider", "Jaw tapers inward", "Narrow or pointed chin"],
  },
  {
    slug: "diamond",
    name: "Diamond",
    image: "/faces/diamond-face.svg",
    traits: ["Cheekbones appear widest", "Narrower upper face", "Tapered jaw and chin"],
  },
  {
    slug: "oblong",
    name: "Oblong",
    image: "/faces/oblong-face.svg",
    traits: ["Noticeably longer than wide", "Fairly straight sides", "Length is the defining feature"],
  },
  {
    slug: "triangle",
    name: "Triangle",
    image: "/faces/triangle-face.svg",
    traits: ["Jaw appears widest", "Upper face looks narrower", "Strong lower-face structure"],
  },
] as const;

export const comparisonHeaders = [
  "Shape",
  "Length",
  "Widest area",
  "Jawline",
  "Chin",
];

export const comparisonRows = [
  ["Oval", "Moderately longer than wide", "Cheekbones", "Soft taper", "Rounded"],
  ["Round", "Close to width", "Cheeks", "Curved", "Rounded"],
  ["Square", "Close to width", "Upper face and jaw", "Broad with corners", "Broad"],
  ["Heart", "Often slightly longer", "Upper face", "Tapers inward", "Narrow or pointed"],
  ["Diamond", "Usually longer", "Cheekbones", "Tapered", "Narrow"],
  ["Oblong", "Clearly longer", "Fairly even", "Straight or softly rounded", "Rounded or broad"],
  ["Triangle", "Varies", "Jaw", "Broad", "Broad or gently pointed"],
];
