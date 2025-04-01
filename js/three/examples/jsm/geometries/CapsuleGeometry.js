import * as THREE from 'three';

/**
 * CapsuleGeometry
 * 
 * Implemented from a technique described here:
 * http://paulbourke.net/geometry/capsule/
 * 
 * The capsule is created aligned to the y-axis with the caps at the top and bottom.
 * Parameters:
 * @param {Number} radius - Radius of the capsule.
 * @param {Number} height - Height of the capsule, not including caps.
 * @param {Number} capSegments - Number of segments in the spherical cap around the circumference.
 * @param {Number} radialSegments - Number of segmented faces around the circumference.
 */
class CapsuleGeometry extends THREE.BufferGeometry {
    constructor(radius = 1, height = 2, capSegments = 8, radialSegments = 16) {
        super();
        
        this.type = 'CapsuleGeometry';
        
        const TWOPI = Math.PI * 2;
        const PID2 = Math.PI / 2;
        
        const vertices = [];
        const normals = [];
        const uvs = [];
        const indices = [];
        
        // Create top cap
        let index = 0;
        const indexArray = [];
        
        // Top cap vertex positions, normals and texcoords
        for (let i = 0; i <= capSegments; i++) {
            const phi = i * Math.PI / capSegments;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);
            
            for (let j = 0; j <= radialSegments; j++) {
                const theta = j * TWOPI / radialSegments;
                const sinTheta = Math.sin(theta);
                const cosTheta = Math.cos(theta);
                
                // Vertex position
                vertices.push(
                    radius * sinPhi * cosTheta,
                    radius * cosPhi + height / 2,
                    radius * sinPhi * sinTheta
                );
                
                // Normal
                normals.push(
                    sinPhi * cosTheta,
                    cosPhi,
                    sinPhi * sinTheta
                );
                
                // Texture coordinates
                uvs.push(j / radialSegments, i / capSegments);
                
                // Add the index to an array of indices
                indexArray.push(index++);
            }
        }
        
        // Set up the indices for the top cap
        for (let i = 0; i < capSegments; i++) {
            for (let j = 0; j < radialSegments; j++) {
                const a = (radialSegments + 1) * i + j;
                const b = (radialSegments + 1) * (i + 1) + j;
                const c = (radialSegments + 1) * (i + 1) + j + 1;
                const d = (radialSegments + 1) * i + j + 1;
                
                // Use two triangles to create the face
                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }
        
        // Remember the height of the top section
        const topIndexEnd = index;
        
        // Create the middle cylinder section
        const capOffset = height / 2;
        for (let i = 0; i <= 1; i++) {
            const y = (i === 0 ? 1 : -1) * capOffset;
            for (let j = 0; j <= radialSegments; j++) {
                const theta = j * TWOPI / radialSegments;
                const sinTheta = Math.sin(theta);
                const cosTheta = Math.cos(theta);
                
                // Vertex position
                vertices.push(
                    radius * cosTheta,
                    y,
                    radius * sinTheta
                );
                
                // Normal
                normals.push(
                    cosTheta,
                    0,
                    sinTheta
                );
                
                // Texture coordinates
                uvs.push(j / radialSegments, i);
                
                // Add the index to an array of indices
                indexArray.push(index++);
            }
        }
        
        // Set up the indices for the middle cylinder
        for (let j = 0; j < radialSegments; j++) {
            const a = topIndexEnd + j;
            const b = topIndexEnd + j + radialSegments + 1;
            const c = topIndexEnd + (j + 1) % (radialSegments + 1) + radialSegments + 1;
            const d = topIndexEnd + (j + 1) % (radialSegments + 1);
            
            // Create the faces for the middle cylinder
            indices.push(a, b, d);
            indices.push(b, c, d);
        }
        
        // Create bottom cap
        const bottomIndexStart = index;
        
        // Bottom cap vertex positions, normals and texcoords
        for (let i = 0; i <= capSegments; i++) {
            const phi = Math.PI - i * Math.PI / capSegments;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);
            
            for (let j = 0; j <= radialSegments; j++) {
                const theta = j * TWOPI / radialSegments;
                const sinTheta = Math.sin(theta);
                const cosTheta = Math.cos(theta);
                
                // Vertex position
                vertices.push(
                    radius * sinPhi * cosTheta,
                    radius * cosPhi - height / 2,
                    radius * sinPhi * sinTheta
                );
                
                // Normal
                normals.push(
                    sinPhi * cosTheta,
                    cosPhi,
                    sinPhi * sinTheta
                );
                
                // Texture coordinates
                uvs.push(j / radialSegments, 1 - i / capSegments);
                
                // Add the index to an array of indices
                indexArray.push(index++);
            }
        }
        
        // Set up the indices for the bottom cap
        for (let i = 0; i < capSegments; i++) {
            for (let j = 0; j < radialSegments; j++) {
                const a = bottomIndexStart + (radialSegments + 1) * i + j;
                const b = bottomIndexStart + (radialSegments + 1) * (i + 1) + j;
                const c = bottomIndexStart + (radialSegments + 1) * (i + 1) + j + 1;
                const d = bottomIndexStart + (radialSegments + 1) * i + j + 1;
                
                // Use two triangles to create the face
                indices.push(a, d, b);
                indices.push(b, d, c);
            }
        }
        
        // Create the buffer attributes
        this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        this.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        this.setIndex(indices);
        
        // Calculate the bounding sphere
        this.computeBoundingSphere();
    }
}

export { CapsuleGeometry }; 