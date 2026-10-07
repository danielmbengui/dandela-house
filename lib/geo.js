import { Matrix4, Quaternion, Vector3 } from "three";

/** Convertit lat/lon (degrés) en position 3D sur une sphère de rayon `radius`. */
export function latLonToVector3(lat, lon, radius) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;

  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

/** Oriente le globe pour que lat/lon fasse face à la caméra (+Z), nord vers le haut. */
export function globeQuaternionToFace(lat, lon) {
  const target = latLonToVector3(lat, lon, 1).normalize();
  const z = target.clone();
  const x = new Vector3().crossVectors(new Vector3(0, 1, 0), z);
  if (x.lengthSq() < 1e-8) x.set(1, 0, 0);
  x.normalize();
  const y = new Vector3().crossVectors(z, x).normalize();
  const basis = new Matrix4().makeBasis(x, y, z);
  return new Quaternion().setFromRotationMatrix(basis).invert();
}
