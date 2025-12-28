const fs = require('fs');
const path = require('path');

// GLB file format parser
function parseGLB(buffer) {
  // GLB header: magic (4 bytes) + version (4 bytes) + length (4 bytes)
  const magic = buffer.toString('utf8', 0, 4);
  if (magic !== 'glTF') {
    throw new Error('Invalid GLB file: magic number mismatch');
  }
  
  const version = buffer.readUInt32LE(4);
  const totalLength = buffer.readUInt32LE(8);
  
  let offset = 12; // Skip header
  
  // Read JSON chunk
  const jsonChunkLength = buffer.readUInt32LE(offset);
  const jsonChunkType = buffer.toString('utf8', offset + 4, offset + 8);
  
  if (jsonChunkType !== 'JSON') {
    throw new Error('Invalid GLB file: JSON chunk not found');
  }
  
  const jsonBuffer = buffer.slice(offset + 8, offset + 8 + jsonChunkLength);
  const jsonString = jsonBuffer.toString('utf8');
  const gltf = JSON.parse(jsonString);
  
  return gltf;
}

// Extract node names from GLTF JSON
function extractNodeNames(gltf) {
  const names = [];
  
  if (gltf.nodes) {
    gltf.nodes.forEach((node, index) => {
      if (node.name) {
        names.push({
          index: index,
          name: node.name,
          type: 'node'
        });
      }
    });
  }
  
  if (gltf.meshes) {
    gltf.meshes.forEach((mesh, index) => {
      if (mesh.name) {
        names.push({
          index: index,
          name: mesh.name,
          type: 'mesh'
        });
      }
    });
  }
  
  if (gltf.materials) {
    gltf.materials.forEach((material, index) => {
      if (material.name) {
        names.push({
          index: index,
          name: material.name,
          type: 'material'
        });
      }
    });
  }
  
  if (gltf.scenes) {
    gltf.scenes.forEach((scene, index) => {
      if (scene.name) {
        names.push({
          index: index,
          name: scene.name,
          type: 'scene'
        });
      }
    });
  }
  
  return names;
}

// Main execution
const glbPath = path.join(__dirname, 'public', 'models', 'Blender2.glb');
const outputPath = path.join(__dirname, 'blender2-layers.txt');

try {
  console.log('Reading GLB file:', glbPath);
  const buffer = fs.readFileSync(glbPath);
  
  console.log('Parsing GLB file...');
  const gltf = parseGLB(buffer);
  
  console.log('Extracting layer/object names...');
  const names = extractNodeNames(gltf);
  
  // Create output content
  let output = 'Blender2.glb - Layer/Object Names\n';
  output += '='.repeat(50) + '\n\n';
  
  if (names.length === 0) {
    output += 'No named objects found in the GLB file.\n';
    output += '\nNote: Some objects might not have names assigned in Blender.\n';
  } else {
    // Group by type
    const byType = {
      node: names.filter(n => n.type === 'node'),
      mesh: names.filter(n => n.type === 'mesh'),
      material: names.filter(n => n.type === 'material'),
      scene: names.filter(n => n.type === 'scene')
    };
    
    if (byType.node.length > 0) {
      output += 'NODES (Objects/Layers):\n';
      output += '-'.repeat(50) + '\n';
      byType.node.forEach(item => {
        output += `  [${item.index}] ${item.name}\n`;
      });
      output += '\n';
    }
    
    if (byType.mesh.length > 0) {
      output += 'MESHES:\n';
      output += '-'.repeat(50) + '\n';
      byType.mesh.forEach(item => {
        output += `  [${item.index}] ${item.name}\n`;
      });
      output += '\n';
    }
    
    if (byType.material.length > 0) {
      output += 'MATERIALS:\n';
      output += '-'.repeat(50) + '\n';
      byType.material.forEach(item => {
        output += `  [${item.index}] ${item.name}\n`;
      });
      output += '\n';
    }
    
    if (byType.scene.length > 0) {
      output += 'SCENES:\n';
      output += '-'.repeat(50) + '\n';
      byType.scene.forEach(item => {
        output += `  [${item.index}] ${item.name}\n`;
      });
      output += '\n';
    }
    
    output += `\nTotal named objects: ${names.length}\n`;
  }
  
  // Write to file
  fs.writeFileSync(outputPath, output, 'utf8');
  console.log(`\n✓ Successfully extracted ${names.length} named objects`);
  console.log(`✓ Output written to: ${outputPath}`);
  
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}

