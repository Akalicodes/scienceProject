// 3D Visualization using Three.js
window.meiosisScenes = {};

// Polyfill for CapsuleGeometry if not available
if (typeof THREE.CapsuleGeometry === 'undefined') {
    THREE.CapsuleGeometry = function(radius, length, capSegments, radialSegments) {
        THREE.BufferGeometry.call(this);
        
        // Create a cylinder with spheres on each end to simulate a capsule
        const cylinderGeom = new THREE.CylinderGeometry(radius, radius, length, radialSegments || 8, 1);
        const topSphereGeom = new THREE.SphereGeometry(radius, radialSegments || 8, capSegments || 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const bottomSphereGeom = new THREE.SphereGeometry(radius, radialSegments || 8, capSegments || 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
        
        // Position spheres
        topSphereGeom.translate(0, length / 2, 0);
        bottomSphereGeom.translate(0, -length / 2, 0);
        
        // Merge geometries
        const mergedGeom = new THREE.BufferGeometry();
        const geometries = [cylinderGeom, topSphereGeom, bottomSphereGeom];
        
        // Merge using manual vertex combination
        let totalVertices = 0;
        let totalIndices = 0;
        
        geometries.forEach(geom => {
            const pos = geom.attributes.position;
            const idx = geom.index;
            totalVertices += pos.count;
            if (idx) totalIndices += idx.count;
        });
        
        const positions = new Float32Array(totalVertices * 3);
        const normals = new Float32Array(totalVertices * 3);
        const indices = new Uint16Array(totalIndices);
        
        let vertexOffset = 0;
        let indexOffset = 0;
        let currentVertex = 0;
        
        geometries.forEach(geom => {
            const pos = geom.attributes.position;
            const norm = geom.attributes.normal;
            const idx = geom.index;
            
            // Copy positions and normals
            for (let i = 0; i < pos.count; i++) {
                positions[vertexOffset++] = pos.getX(i);
                positions[vertexOffset++] = pos.getY(i);
                positions[vertexOffset++] = pos.getZ(i);
                
                normals[(vertexOffset - 3)] = norm.getX(i);
                normals[(vertexOffset - 2)] = norm.getY(i);
                normals[(vertexOffset - 1)] = norm.getZ(i);
            }
            
            // Copy indices with offset
            if (idx) {
                for (let i = 0; i < idx.count; i++) {
                    indices[indexOffset++] = idx.getX(i) + currentVertex;
                }
            }
            
            currentVertex += pos.count;
        });
        
        mergedGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        mergedGeom.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
        mergedGeom.setIndex(new THREE.BufferAttribute(indices, 1));
        
        return mergedGeom;
    };
    
    THREE.CapsuleGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
    THREE.CapsuleGeometry.prototype.constructor = THREE.CapsuleGeometry;
}

// Utility function to create chromosome materials
function createChromosomeMaterial(color, glowColor) {
    return new THREE.MeshPhongMaterial({
        color: color,
        emissive: glowColor,
        emissiveIntensity: 0.3,
        shininess: 30,
        specular: 0x444444
    });
}

// Create a chromosome (X-shape representing sister chromatids)
function createChromosome(color, glowColor, position, scale = 1) {
    const group = new THREE.Group();
    group.userData.type = 'chromosome';
    
    // Chromatid 1 - with more detailed structure
    const chromatid1 = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.3 * scale, 3 * scale, 8, 16),
        createChromosomeMaterial(color, glowColor)
    );
    chromatid1.position.x = -0.2 * scale;
    chromatid1.rotation.z = Math.PI / 8;
    chromatid1.userData.type = 'chromatid';
    
    // Add DNA coiling detail to chromatid 1
    for (let i = 0; i < 5; i++) {
        const coil = new THREE.Mesh(
            new THREE.TorusGeometry(0.15 * scale, 0.05 * scale, 8, 12),
            new THREE.MeshPhongMaterial({
                color: color,
                emissive: glowColor,
                emissiveIntensity: 0.2,
                transparent: true,
                opacity: 0.6
            })
        );
        coil.position.set(-0.2 * scale, (i - 2) * 0.6 * scale, 0);
        coil.rotation.x = Math.PI / 2;
        coil.userData.type = 'chromatid';
        group.add(coil);
    }
    
    // Chromatid 2 - with more detailed structure
    const chromatid2 = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.3 * scale, 3 * scale, 8, 16),
        createChromosomeMaterial(color, glowColor)
    );
    chromatid2.position.x = 0.2 * scale;
    chromatid2.rotation.z = -Math.PI / 8;
    chromatid2.userData.type = 'chromatid';
    
    // Add DNA coiling detail to chromatid 2
    for (let i = 0; i < 5; i++) {
        const coil = new THREE.Mesh(
            new THREE.TorusGeometry(0.15 * scale, 0.05 * scale, 8, 12),
            new THREE.MeshPhongMaterial({
                color: color,
                emissive: glowColor,
                emissiveIntensity: 0.2,
                transparent: true,
                opacity: 0.6
            })
        );
        coil.position.set(0.2 * scale, (i - 2) * 0.6 * scale, 0);
        coil.rotation.x = Math.PI / 2;
        coil.userData.type = 'chromatid';
        group.add(coil);
    }
    
    // Centromere - larger and more detailed
    const centromere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5 * scale, 16, 16),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            emissive: glowColor,
            emissiveIntensity: 0.5
        })
    );
    centromere.userData.type = 'centromere';
    
    // Kinetochore plates on centromere
    const kinetochore1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.3 * scale, 0.1 * scale, 0.3 * scale),
        new THREE.MeshPhongMaterial({
            color: 0xffaa00,
            emissive: 0xff8800,
            emissiveIntensity: 0.4
        })
    );
    kinetochore1.position.y = 0.3 * scale;
    kinetochore1.userData.type = 'centromere';
    
    const kinetochore2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.3 * scale, 0.1 * scale, 0.3 * scale),
        new THREE.MeshPhongMaterial({
            color: 0xffaa00,
            emissive: 0xff8800,
            emissiveIntensity: 0.4
        })
    );
    kinetochore2.position.y = -0.3 * scale;
    kinetochore2.userData.type = 'centromere';
    
    group.add(chromatid1);
    group.add(chromatid2);
    group.add(centromere);
    group.add(kinetochore1);
    group.add(kinetochore2);
    group.position.copy(position);
    
    return group;
}

// Create cell membrane with more detail
function createCellMembrane(radius = 10, opacity = 0.15) {
    const group = new THREE.Group();
    
    // Main membrane
    const membrane = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 32, 32),
        new THREE.MeshPhongMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: opacity,
            side: THREE.DoubleSide,
            emissive: 0x00d4ff,
            emissiveIntensity: 0.2
        })
    );
    membrane.userData.type = 'membrane';
    membrane.raycast = function() {};
    group.add(membrane);
    
    // Add membrane proteins (small spheres on surface)
    for (let i = 0; i < 20; i++) {
        const phi = Math.acos(-1 + (2 * i) / 20);
        const theta = Math.sqrt(20 * Math.PI) * phi;
        
        const protein = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 8, 8),
            new THREE.MeshPhongMaterial({
                color: 0x44ffaa,
                emissive: 0x22aa77,
                emissiveIntensity: 0.3
            })
        );
        
        protein.position.x = radius * Math.sin(phi) * Math.cos(theta);
        protein.position.y = radius * Math.sin(phi) * Math.sin(theta);
        protein.position.z = radius * Math.cos(phi);
        protein.userData.type = 'membrane';
        protein.raycast = function() {};
        group.add(protein);
    }
    
    return group;
}

// Create spindle fiber with more detail
function createSpindleFiber(start, end) {
    const group = new THREE.Group();
    
    // Main fiber line
    const points = [start, end];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: 0xa855f7,
        transparent: true,
        opacity: 0.6,
        linewidth: 2
    });
    const line = new THREE.Line(geometry, material);
    line.userData.type = 'spindle';
    group.add(line);
    
    // Add microtubule segments for detail
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();
    direction.normalize();
    
    for (let i = 0; i < 3; i++) {
        const segment = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.05, length / 4, 6),
            new THREE.MeshPhongMaterial({
                color: 0xa855f7,
                emissive: 0x7733bb,
                emissiveIntensity: 0.3,
                transparent: true,
                opacity: 0.5
            })
        );
        
        const position = new THREE.Vector3().lerpVectors(start, end, (i + 0.5) / 4);
        segment.position.copy(position);
        segment.lookAt(end);
        segment.rotateX(Math.PI / 2);
        segment.userData.type = 'spindle';
        group.add(segment);
    }
    
    return group;
}

// Create centriole pair (spindle pole organizers)
function createCentriole(position, scale = 1) {
    const group = new THREE.Group();
    
    // Two perpendicular centrioles
    for (let i = 0; i < 2; i++) {
        const centriole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2 * scale, 0.2 * scale, 1.5 * scale, 9),
            new THREE.MeshPhongMaterial({
                color: 0xff6600,
                emissive: 0xcc4400,
                emissiveIntensity: 0.4
            })
        );
        
        if (i === 0) {
            centriole.rotation.z = Math.PI / 2;
        } else {
            centriole.rotation.x = Math.PI / 2;
        }
        
        centriole.userData.type = 'centriole';
        group.add(centriole);
        
        // Add radiating microtubules
        for (let j = 0; j < 9; j++) {
            const angle = (j / 9) * Math.PI * 2;
            const microtubule = new THREE.Mesh(
                new THREE.CylinderGeometry(0.03 * scale, 0.03 * scale, 0.8 * scale, 4),
                new THREE.MeshPhongMaterial({
                    color: 0xaa4400,
                    emissive: 0x884400,
                    emissiveIntensity: 0.2,
                    transparent: true,
                    opacity: 0.6
                })
            );
            
            const radius = 0.4 * scale;
            if (i === 0) {
                microtubule.position.set(
                    Math.cos(angle) * radius,
                    Math.sin(angle) * radius,
                    0
                );
                microtubule.rotation.z = angle;
            } else {
                microtubule.position.set(
                    Math.cos(angle) * radius,
                    0,
                    Math.sin(angle) * radius
                );
                microtubule.rotation.x = Math.PI / 2;
                microtubule.rotation.y = angle;
            }
            
            microtubule.userData.type = 'centriole';
            group.add(microtubule);
        }
    }
    
    group.position.copy(position);
    return group;
}

// Setup basic scene
function setupScene(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return null;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.PerspectiveCamera(
        50,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 25;
    
    // Optimize for mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const pixelRatio = isMobile ? Math.min(window.devicePixelRatio, 2) : window.devicePixelRatio;
    
    const renderer = new THREE.WebGLRenderer({ 
        antialias: !isMobile, // Disable antialiasing on mobile for better performance
        alpha: true,
        powerPreference: isMobile ? 'low-power' : 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(pixelRatio);
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x00d4ff, 1, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xa855f7, 1, 100);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);
    
    return { 
        scene, 
        camera, 
        renderer, 
        container,
        autoRotate: true,
        isAnimating: false,
        hoveredObject: null,
        hoverLabel: null,
        isMobile: isMobile
    };
}

// Animation loop
function animate(sceneData) {
    if (!sceneData.isAnimating) return;
    
    requestAnimationFrame(() => animate(sceneData));
    
    // Auto-rotate if enabled
    if (sceneData.autoRotate) {
        sceneData.scene.rotation.y += 0.002;
    }
    
    // Animate specific elements
    if (sceneData.animateCallback) {
        sceneData.animateCallback();
    }
    
    sceneData.renderer.render(sceneData.scene, sceneData.camera);
}

// Start animation loop
function startAnimation(sceneData) {
    if (!sceneData.isAnimating) {
        sceneData.isAnimating = true;
        animate(sceneData);
    }
}

// Enable mouse and touch controls with hover detection
function enableControls(sceneData) {
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let previousTouchDistance = 0;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Create hover label element
    const hoverLabel = document.createElement('div');
    hoverLabel.className = 'hover-label';
    hoverLabel.style.display = 'none';
    sceneData.container.appendChild(hoverLabel);
    sceneData.hoverLabel = hoverLabel;
    
    // Show mobile hint on first touch (only once per session)
    if (sceneData.isMobile && !sessionStorage.getItem('meiosis_mobile_hint_shown')) {
        const mobileHint = document.createElement('div');
        mobileHint.className = 'mobile-3d-hint';
        mobileHint.textContent = '👆 Drag to rotate • 🤏 Pinch to zoom';
        sceneData.container.appendChild(mobileHint);
        
        setTimeout(() => {
            mobileHint.remove();
        }, 4000);
        
        sessionStorage.setItem('meiosis_mobile_hint_shown', 'true');
    }
    
    // Helper function to get position from event (works for mouse and touch)
    function getEventPosition(e) {
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    }
    
    // Helper function for hover detection
    function checkHover(clientX, clientY) {
        const rect = sceneData.container.getBoundingClientRect();
        mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, sceneData.camera);
        const intersects = raycaster.intersectObjects(sceneData.scene.children, true);
        
        // Reset previous hover
        if (sceneData.hoveredObject) {
            if (sceneData.hoveredObject.material && sceneData.hoveredObject.material.emissive) {
                sceneData.hoveredObject.material.emissiveIntensity = 0.3;
            }
            sceneData.hoveredObject = null;
        }
        
        // Find first valid object
        let found = false;
        for (let i = 0; i < intersects.length; i++) {
            const object = intersects[i].object;
            const userData = object.userData || {};
            
            // Skip if no type defined or if it's a membrane
            if (!userData.type || userData.type === 'membrane') continue;
            
            // Get label text based on userData type
            const labelMap = {
                'chromatid': '🧬 Chromatid (Chromosome Arm)',
                'centromere': '🔵 Centromere (Connection Point)',
                'chromosome': '🧬 Chromosome',
                'chromatin': '🔬 Chromatin (Unwound DNA)',
                'spindle': '🕸️ Spindle Fiber (Pulls Chromosomes)',
                'crossover': '✨ Crossover Point (DNA Swap)',
                'centriole': '⚙️ Centriole (Organizes Spindle)',
                'nucleus': '🫧 Nuclear Envelope'
            };
            
            const labelText = labelMap[userData.type];
            
            if (labelText) {
                // Highlight objects with emissive materials (chromosomes)
                if (object.material && object.material.emissive) {
                    sceneData.hoveredObject = object;
                    object.material.emissiveIntensity = 0.8;
                }
                
                // Show label
                hoverLabel.textContent = labelText;
                hoverLabel.style.display = 'block';
                hoverLabel.style.left = (clientX - rect.left + 15) + 'px';
                hoverLabel.style.top = (clientY - rect.top + 15) + 'px';
                found = true;
                break;
            }
        }
        
        if (!found) {
            hoverLabel.style.display = 'none';
        }
    }
    
    // Mouse events
    sceneData.container.addEventListener('mousedown', () => {
        isDragging = true;
    });
    
    sceneData.container.addEventListener('mousemove', (e) => {
        const rect = sceneData.container.getBoundingClientRect();
        
        if (isDragging) {
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            sceneData.scene.rotation.y += deltaX * 0.01;
            sceneData.scene.rotation.x += deltaY * 0.01;
        } else {
            checkHover(e.clientX, e.clientY);
        }
        
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    sceneData.container.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    sceneData.container.addEventListener('mouseleave', () => {
        isDragging = false;
        if (sceneData.hoveredObject && sceneData.hoveredObject.material && sceneData.hoveredObject.material.emissive) {
            sceneData.hoveredObject.material.emissiveIntensity = 0.3;
            sceneData.hoveredObject = null;
        }
        if (hoverLabel) {
            hoverLabel.style.display = 'none';
        }
    });
    
    // Touch events for mobile
    sceneData.container.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDragging = true;
        const pos = getEventPosition(e);
        previousMousePosition = pos;
        
        // Initialize pinch zoom
        if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            previousTouchDistance = Math.sqrt(dx * dx + dy * dy);
        }
    }, { passive: false });
    
    sceneData.container.addEventListener('touchmove', (e) => {
        e.preventDefault();
        
        if (e.touches.length === 1) {
            // Single finger - rotate
            const pos = getEventPosition(e);
            if (isDragging) {
                const deltaX = pos.x - previousMousePosition.x;
                const deltaY = pos.y - previousMousePosition.y;
                sceneData.scene.rotation.y += deltaX * 0.01;
                sceneData.scene.rotation.x += deltaY * 0.01;
            }
            previousMousePosition = pos;
            
            // Show hover on touch
            checkHover(pos.x, pos.y);
        } else if (e.touches.length === 2) {
            // Two fingers - pinch zoom
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (previousTouchDistance > 0) {
                const delta = previousTouchDistance - distance;
                sceneData.camera.position.z += delta * 0.05;
                sceneData.camera.position.z = Math.max(10, Math.min(40, sceneData.camera.position.z));
            }
            
            previousTouchDistance = distance;
        }
    }, { passive: false });
    
    sceneData.container.addEventListener('touchend', (e) => {
        e.preventDefault();
        isDragging = false;
        previousTouchDistance = 0;
        
        // Hide label after a delay on touch end
        setTimeout(() => {
            if (hoverLabel) {
                hoverLabel.style.display = 'none';
            }
            if (sceneData.hoveredObject && sceneData.hoveredObject.material && sceneData.hoveredObject.material.emissive) {
                sceneData.hoveredObject.material.emissiveIntensity = 0.3;
                sceneData.hoveredObject = null;
            }
        }, 1000);
    }, { passive: false });
    
    // Zoom with mouse wheel
    sceneData.container.addEventListener('wheel', (e) => {
        e.preventDefault();
        sceneData.camera.position.z += e.deltaY * 0.01;
        sceneData.camera.position.z = Math.max(10, Math.min(40, sceneData.camera.position.z));
    }, { passive: false });
}

// Scene Creation Functions

// Hero Scene - Rotating DNA-like structure
function createHeroScene() {
    const sceneData = setupScene('hero-canvas');
    if (!sceneData) return;
    
    // Create rotating chromosome pairs
    const colors = [
        { color: 0x00d4ff, glow: 0x0088aa },
        { color: 0xa855f7, glow: 0x7733bb },
        { color: 0xec4899, glow: 0xaa3377 },
        { color: 0x10b981, glow: 0x0a7755 }
    ];
    
    const chromosomes = [];
    colors.forEach((colorSet, i) => {
        const angle = (i / colors.length) * Math.PI * 2;
        const radius = 8;
        const chr = createChromosome(
            colorSet.color,
            colorSet.glow,
            new THREE.Vector3(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius * 0.5,
                0
            ),
            1.2
        );
        chromosomes.push(chr);
        sceneData.scene.add(chr);
    });
    
    // Animation
    sceneData.animateCallback = () => {
        sceneData.scene.rotation.y += 0.003;
        chromosomes.forEach((chr, i) => {
            chr.rotation.z += 0.01;
            chr.position.y += Math.sin(Date.now() * 0.001 + i) * 0.01;
        });
    };
    
    enableControls(sceneData);
    startAnimation(sceneData);
    window.meiosisScenes.hero = sceneData;
}

// Interphase Scene
function createInterphaseScene() {
    const sceneData = setupScene('canvas-interphase');
    if (!sceneData) return;
    
    const membrane = createCellMembrane();
    sceneData.scene.add(membrane);
    
    // Nuclear membrane
    const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(7, 24, 24),
        new THREE.MeshPhongMaterial({
            color: 0x6644ff,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide,
            emissive: 0x4422aa,
            emissiveIntensity: 0.2
        })
    );
    nucleus.userData.type = 'nucleus';
    sceneData.scene.add(nucleus);
    
    // Unreplicated chromosomes (loose chromatin) - more detailed
    const chromatinParticles = new THREE.Group();
    
    // Create DNA strands
    for (let strand = 0; strand < 8; strand++) {
        const strandGroup = new THREE.Group();
        const points = [];
        const numPoints = 30;
        
        for (let i = 0; i < numPoints; i++) {
            const t = i / numPoints;
            const angle = t * Math.PI * 4 + strand * Math.PI / 4;
            const radius = 3 + Math.sin(t * Math.PI * 2) * 1.5;
            
            points.push(new THREE.Vector3(
                Math.cos(angle) * radius,
                (t - 0.5) * 10,
                Math.sin(angle) * radius
            ));
        }
        
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.08, 8, false);
        const tubeMaterial = new THREE.MeshPhongMaterial({
            color: 0x00d4ff,
            emissive: 0x0088aa,
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0.8
        });
        
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        tube.userData.type = 'chromatin';
        strandGroup.add(tube);
        
        // Add particles along the strand
        for (let i = 0; i < 15; i++) {
            const particle = new THREE.Mesh(
                new THREE.SphereGeometry(0.15, 8, 8),
                new THREE.MeshPhongMaterial({
                    color: 0x00ffcc,
                    emissive: 0x00aa88,
                    emissiveIntensity: 0.5
                })
            );
            const pos = points[Math.floor(i * numPoints / 15)];
            particle.position.copy(pos);
            particle.userData.type = 'chromatin';
            strandGroup.add(particle);
        }
        
        chromatinParticles.add(strandGroup);
    }
    
    sceneData.scene.add(chromatinParticles);
    
    // Add centrioles
    const centrioles = createCentriole(new THREE.Vector3(6, 0, 0), 0.8);
    sceneData.scene.add(centrioles);
    
    sceneData.animateCallback = () => {
        membrane.rotation.y += 0.001;
        nucleus.rotation.y += 0.001;
        chromatinParticles.rotation.y += 0.002;
        chromatinParticles.children.forEach((strand, i) => {
            strand.rotation.z += 0.001 * (i % 2 === 0 ? 1 : -1);
        });
    };
    
    enableControls(sceneData);
    startAnimation(sceneData);
    window.meiosisScenes.interphase = sceneData;
}

// Prophase I Scene
function createProphase1Scene() {
    const sceneData = setupScene('canvas-prophase1');
    if (!sceneData) return;
    
    const membrane = createCellMembrane(10, 0.1);
    sceneData.scene.add(membrane);
    
    // Homologous pairs with crossover
    const pair1_chr1 = createChromosome(0xff6b9d, 0xaa3377, new THREE.Vector3(-2, 2, 0));
    const pair1_chr2 = createChromosome(0x00d4ff, 0x0088aa, new THREE.Vector3(-2, -2, 0));
    
    const pair2_chr1 = createChromosome(0xa855f7, 0x7733bb, new THREE.Vector3(2, 2, 0));
    const pair2_chr2 = createChromosome(0x10b981, 0x0a7755, new THREE.Vector3(2, -2, 0));
    
    sceneData.scene.add(pair1_chr1, pair1_chr2, pair2_chr1, pair2_chr2);
    
    // Crossover highlights with DNA exchange visualization
    const crossover1 = new THREE.Mesh(
        new THREE.RingGeometry(1, 1.5, 32),
        new THREE.MeshBasicMaterial({
            color: 0xffff00,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide
        })
    );
    crossover1.position.set(-2, 0, 0);
    crossover1.userData.type = 'crossover';
    sceneData.scene.add(crossover1);
    
    // Add DNA exchange lines for pair 1
    const exchangePoints1 = [
        new THREE.Vector3(-2, 1.5, 0),
        new THREE.Vector3(-1.8, 0, 0),
        new THREE.Vector3(-2, -1.5, 0)
    ];
    const exchangeCurve1 = new THREE.CatmullRomCurve3(exchangePoints1);
    const exchangeGeometry1 = new THREE.TubeGeometry(exchangeCurve1, 20, 0.1, 8, false);
    const exchangeMaterial1 = new THREE.MeshPhongMaterial({
        color: 0xffff00,
        emissive: 0xffaa00,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7
    });
    const exchangeTube1 = new THREE.Mesh(exchangeGeometry1, exchangeMaterial1);
    exchangeTube1.userData.type = 'crossover';
    sceneData.scene.add(exchangeTube1);
    
    const crossover2 = new THREE.Mesh(
        new THREE.RingGeometry(1, 1.5, 32),
        new THREE.MeshBasicMaterial({
            color: 0xffff00,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide
        })
    );
    crossover2.position.set(2, 0, 0);
    crossover2.userData.type = 'crossover';
    sceneData.scene.add(crossover2);
    
    // Add DNA exchange lines for pair 2
    const exchangePoints2 = [
        new THREE.Vector3(2, 1.5, 0),
        new THREE.Vector3(2.2, 0, 0),
        new THREE.Vector3(2, -1.5, 0)
    ];
    const exchangeCurve2 = new THREE.CatmullRomCurve3(exchangePoints2);
    const exchangeGeometry2 = new THREE.TubeGeometry(exchangeCurve2, 20, 0.1, 8, false);
    const exchangeTube2 = new THREE.Mesh(exchangeGeometry2, exchangeMaterial1);
    exchangeTube2.userData.type = 'crossover';
    sceneData.scene.add(exchangeTube2);
    
    // Add synaptonemal complex (protein structure holding homologs together)
    for (let pair of [[-2, 0], [2, 0]]) {
        const complex = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 3, 0.2),
            new THREE.MeshPhongMaterial({
                color: 0x9966ff,
                emissive: 0x6633aa,
                emissiveIntensity: 0.3,
                transparent: true,
                opacity: 0.5
            })
        );
        complex.position.set(pair[0], pair[1], 0);
        complex.userData.type = 'crossover';
        sceneData.scene.add(complex);
    }
    
    // Add centrioles at poles
    const centriole1 = createCentriole(new THREE.Vector3(0, 8, 0), 0.6);
    const centriole2 = createCentriole(new THREE.Vector3(0, -8, 0), 0.6);
    sceneData.scene.add(centriole1, centriole2);
    
    sceneData.animateCallback = () => {
        membrane.rotation.y += 0.001;
        crossover1.rotation.z += 0.02;
        crossover2.rotation.z -= 0.02;
        exchangeTube1.rotation.z += 0.01;
        exchangeTube2.rotation.z -= 0.01;
    };
    
    enableControls(sceneData);
    startAnimation(sceneData);
    window.meiosisScenes.prophase1 = sceneData;
}

// Metaphase I Scene
function createMetaphase1Scene() {
    const sceneData = setupScene('canvas-metaphase1');
    if (!sceneData) return;
    
    const membrane = createCellMembrane(10, 0.1);
    sceneData.scene.add(membrane);
    
    // Chromosomes aligned at metaphase plate
    const chromosomes = [
        createChromosome(0xff6b9d, 0xaa3377, new THREE.Vector3(-4, 0, 0)),
        createChromosome(0x00d4ff, 0x0088aa, new THREE.Vector3(-1.5, 0, 0)),
        createChromosome(0xa855f7, 0x7733bb, new THREE.Vector3(1.5, 0, 0)),
        createChromosome(0x10b981, 0x0a7755, new THREE.Vector3(4, 0, 0))
    ];
    
    chromosomes.forEach(chr => sceneData.scene.add(chr));
    
    // Add centrioles at spindle poles
    const centriole1 = createCentriole(new THREE.Vector3(0, 10, 0), 0.7);
    const centriole2 = createCentriole(new THREE.Vector3(0, -10, 0), 0.7);
    sceneData.scene.add(centriole1, centriole2);
    
    // Enhanced spindle fibers connecting to kinetochores
    chromosomes.forEach(chr => {
        // Fibers to top pole
        const spindle1 = createSpindleFiber(
            new THREE.Vector3(chr.position.x, chr.position.y + 0.3, chr.position.z),
            new THREE.Vector3(0, 10, 0)
        );
        // Fibers to bottom pole
        const spindle2 = createSpindleFiber(
            new THREE.Vector3(chr.position.x, chr.position.y - 0.3, chr.position.z),
            new THREE.Vector3(0, -10, 0)
        );
        sceneData.scene.add(spindle1, spindle2);
    });
    
    // Metaphase plate indicator - more detailed
    const plate = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 0.1),
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
        })
    );
    sceneData.scene.add(plate);
    
    // Add glowing line to emphasize metaphase plate
    const plateLine = new THREE.Mesh(
        new THREE.BoxGeometry(15, 0.05, 0.05),
        new THREE.MeshPhongMaterial({
            color: 0x00ffff,
            emissive: 0x00aaaa,
            emissiveIntensity: 0.8
        })
    );
    sceneData.scene.add(plateLine);
    
    sceneData.animateCallback = () => {
        membrane.rotation.y += 0.001;
        plateLine.material.emissiveIntensity = 0.6 + Math.sin(Date.now() * 0.002) * 0.3;
    };
    
    enableControls(sceneData);
    startAnimation(sceneData);
    window.meiosisScenes.metaphase1 = sceneData;
}

// Anaphase I Scene
function createAnaphase1Scene() {
    const sceneData = setupScene('canvas-anaphase1');
    if (!sceneData) return;
    
    const membrane = createCellMembrane(12, 0.1);
    membrane.scale.set(1, 1.3, 1);
    sceneData.scene.add(membrane);
    
    // Separating homologous chromosomes
    const topChromosomes = [
        createChromosome(0xff6b9d, 0xaa3377, new THREE.Vector3(-3, 6, 0)),
        createChromosome(0xa855f7, 0x7733bb, new THREE.Vector3(3, 6, 0))
    ];
    
    const bottomChromosomes = [
        createChromosome(0x00d4ff, 0x0088aa, new THREE.Vector3(-3, -6, 0)),
        createChromosome(0x10b981, 0x0a7755, new THREE.Vector3(3, -6, 0))
    ];
    
    [...topChromosomes, ...bottomChromosomes].forEach(chr => sceneData.scene.add(chr));
    
    // Add centrioles at poles
    const centriole1 = createCentriole(new THREE.Vector3(0, 10, 0), 0.7);
    const centriole2 = createCentriole(new THREE.Vector3(0, -10, 0), 0.7);
    sceneData.scene.add(centriole1, centriole2);
    
    // Enhanced spindle fibers showing tension
    topChromosomes.forEach(chr => {
        const spindle = createSpindleFiber(
            new THREE.Vector3(chr.position.x, chr.position.y + 0.3, chr.position.z),
            new THREE.Vector3(0, 10, 0)
        );
        sceneData.scene.add(spindle);
        
        // Add force indicators (small arrows)
        const arrow = new THREE.Mesh(
            new THREE.ConeGeometry(0.3, 0.6, 8),
            new THREE.MeshPhongMaterial({
                color: 0xffaa00,
                emissive: 0xff8800,
                emissiveIntensity: 0.5
            })
        );
        arrow.position.set(chr.position.x, chr.position.y + 2, chr.position.z);
        arrow.rotation.z = Math.PI;
        sceneData.scene.add(arrow);
    });
    
    bottomChromosomes.forEach(chr => {
        const spindle = createSpindleFiber(
            new THREE.Vector3(chr.position.x, chr.position.y - 0.3, chr.position.z),
            new THREE.Vector3(0, -10, 0)
        );
        sceneData.scene.add(spindle);
        
        // Add force indicators (small arrows)
        const arrow = new THREE.Mesh(
            new THREE.ConeGeometry(0.3, 0.6, 8),
            new THREE.MeshPhongMaterial({
                color: 0xffaa00,
                emissive: 0xff8800,
                emissiveIntensity: 0.5
            })
        );
        arrow.position.set(chr.position.x, chr.position.y - 2, chr.position.z);
        sceneData.scene.add(arrow);
    });
    
    // Add cleavage furrow indicator
    const furrow = new THREE.Mesh(
        new THREE.TorusGeometry(11, 0.3, 16, 32),
        new THREE.MeshPhongMaterial({
            color: 0x00ffaa,
            emissive: 0x00aa77,
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0.6
        })
    );
    furrow.rotation.x = Math.PI / 2;
    sceneData.scene.add(furrow);
    
    sceneData.animateCallback = () => {
        membrane.rotation.y += 0.001;
        furrow.material.emissiveIntensity = 0.3 + Math.sin(Date.now() * 0.003) * 0.2;
    };
    
    enableControls(sceneData);
    startAnimation(sceneData);
    window.meiosisScenes.anaphase1 = sceneData;
}

// Telophase I Scene
function createTelophase1Scene() {
    const sceneData = setupScene('canvas-telophase1');
    if (!sceneData) return;
    
    // Two forming cells
    const membrane1 = createCellMembrane(6, 0.15);
    membrane1.position.y = 5;
    const membrane2 = createCellMembrane(6, 0.15);
    membrane2.position.y = -5;
    sceneData.scene.add(membrane1, membrane2);
    
    // Chromosomes at poles
    const topChromosomes = [
        createChromosome(0xff6b9d, 0xaa3377, new THREE.Vector3(-2, 5, 0), 0.8),
        createChromosome(0xa855f7, 0x7733bb, new THREE.Vector3(2, 5, 0), 0.8)
    ];
    
    const bottomChromosomes = [
        createChromosome(0x00d4ff, 0x0088aa, new THREE.Vector3(-2, -5, 0), 0.8),
        createChromosome(0x10b981, 0x0a7755, new THREE.Vector3(2, -5, 0), 0.8)
    ];
    
    [...topChromosomes, ...bottomChromosomes].forEach(chr => sceneData.scene.add(chr));
    
    sceneData.animateCallback = () => {
        membrane1.rotation.y += 0.002;
        membrane2.rotation.y += 0.002;
    };
    
    enableControls(sceneData);
    startAnimation(sceneData);
    window.meiosisScenes.telophase1 = sceneData;
}

// Cytokinesis I Scene
function createCytokinesis1Scene() {
    const sceneData = setupScene('canvas-cytokinesis1');
    if (!sceneData) return;
    
    // Two separate cells
    const membrane1 = createCellMembrane(5, 0.2);
    membrane1.position.set(-6, 0, 0);
    const membrane2 = createCellMembrane(5, 0.2);
    membrane2.position.set(6, 0, 0);
    sceneData.scene.add(membrane1, membrane2);
    
    // Chromosomes in each cell
    const cell1Chromosomes = [
        createChromosome(0xff6b9d, 0xaa3377, new THREE.Vector3(-7, 0, 0), 0.7),
        createChromosome(0xa855f7, 0x7733bb, new THREE.Vector3(-5, 0, 0), 0.7)
    ];
    
    const cell2Chromosomes = [
        createChromosome(0x00d4ff, 0x0088aa, new THREE.Vector3(5, 0, 0), 0.7),
        createChromosome(0x10b981, 0x0a7755, new THREE.Vector3(7, 0, 0), 0.7)
    ];
    
    [...cell1Chromosomes, ...cell2Chromosomes].forEach(chr => sceneData.scene.add(chr));
    
    sceneData.animateCallback = () => {
        membrane1.rotation.y += 0.002;
        membrane2.rotation.y += 0.002;
    };
    
    enableControls(sceneData);
    startAnimation(sceneData);
    window.meiosisScenes.cytokinesis1 = sceneData;
}

// Interkinesis Scene
function createInterkinesisScene() {
    const sceneData = setupScene('canvas-interkinesis');
    if (!sceneData) return;
    
    // Two separate resting cells
    const membrane1 = createCellMembrane(5, 0.2);
    membrane1.position.set(-6, 0, 0);
    const membrane2 = createCellMembrane(5, 0.2);
    membrane2.position.set(6, 0, 0);
    sceneData.scene.add(membrane1, membrane2);
    
    // Chromosomes in resting state (slightly decondensed)
    const cell1Chromosomes = [
        createChromosome(0xff6b9d, 0xaa3377, new THREE.Vector3(-7, 1, 0), 0.6),
        createChromosome(0xa855f7, 0x7733bb, new THREE.Vector3(-5, -1, 0), 0.6)
    ];
    
    const cell2Chromosomes = [
        createChromosome(0x00d4ff, 0x0088aa, new THREE.Vector3(5, 1, 0), 0.6),
        createChromosome(0x10b981, 0x0a7755, new THREE.Vector3(7, -1, 0), 0.6)
    ];
    
    [...cell1Chromosomes, ...cell2Chromosomes].forEach(chr => {
        sceneData.scene.add(chr);
        // Make chromosomes slightly transparent to show resting state
        chr.children.forEach(mesh => {
            if (mesh.material) {
                mesh.material.transparent = true;
                mesh.material.opacity = 0.8;
            }
        });
    });
    
    sceneData.animateCallback = () => {
        membrane1.rotation.y += 0.001;
        membrane2.rotation.y += 0.001;
        // Gentle pulsing to show cells are "resting"
        const pulse = Math.sin(Date.now() * 0.001) * 0.02;
        membrane1.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
        membrane2.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
    };
    
    enableControls(sceneData);
    startAnimation(sceneData);
    window.meiosisScenes.interkinesis = sceneData;
}

// Prophase II Scene
function createProphase2Scene() {
    const sceneData = setupScene('canvas-prophase2');
    if (!sceneData) return;
    
    // Two cells preparing for second division
    const membrane1 = createCellMembrane(5, 0.15);
    membrane1.position.set(-6, 0, 0);
    const membrane2 = createCellMembrane(5, 0.15);
    membrane2.position.set(6, 0, 0);
    sceneData.scene.add(membrane1, membrane2);
    
    // Condensed chromosomes
    const cell1Chromosomes = [
        createChromosome(0xff6b9d, 0xaa3377, new THREE.Vector3(-7, 1, 0), 0.7),
        createChromosome(0xa855f7, 0x7733bb, new THREE.Vector3(-5, -1, 0), 0.7)
    ];
    
    const cell2Chromosomes = [
        createChromosome(0x00d4ff, 0x0088aa, new THREE.Vector3(5, 1, 0), 0.7),
        createChromosome(0x10b981, 0x0a7755, new THREE.Vector3(7, -1, 0), 0.7)
    ];
    
    [...cell1Chromosomes, ...cell2Chromosomes].forEach(chr => sceneData.scene.add(chr));
    
    sceneData.animateCallback = () => {
        membrane1.rotation.y += 0.002;
        membrane2.rotation.y += 0.002;
    };
    
    enableControls(sceneData);
    startAnimation(sceneData);
    window.meiosisScenes.prophase2 = sceneData;
}

// Metaphase II Scene
function createMetaphase2Scene() {
    const sceneData = setupScene('canvas-metaphase2');
    if (!sceneData) return;
    
    // Two cells with chromosomes at metaphase plate
    const membrane1 = createCellMembrane(5, 0.15);
    membrane1.position.set(-6, 0, 0);
    const membrane2 = createCellMembrane(5, 0.15);
    membrane2.position.set(6, 0, 0);
    sceneData.scene.add(membrane1, membrane2);
    
    // Chromosomes aligned
    const cell1Chromosomes = [
        createChromosome(0xff6b9d, 0xaa3377, new THREE.Vector3(-7, 0, 0), 0.6),
        createChromosome(0xa855f7, 0x7733bb, new THREE.Vector3(-5, 0, 0), 0.6)
    ];
    
    const cell2Chromosomes = [
        createChromosome(0x00d4ff, 0x0088aa, new THREE.Vector3(5, 0, 0), 0.6),
        createChromosome(0x10b981, 0x0a7755, new THREE.Vector3(7, 0, 0), 0.6)
    ];
    
    [...cell1Chromosomes, ...cell2Chromosomes].forEach(chr => sceneData.scene.add(chr));
    
    sceneData.animateCallback = () => {
        membrane1.rotation.y += 0.002;
        membrane2.rotation.y += 0.002;
    };
    
    enableControls(sceneData);
    startAnimation(sceneData);
    window.meiosisScenes.metaphase2 = sceneData;
}

// Anaphase II Scene
function createAnaphase2Scene() {
    const sceneData = setupScene('canvas-anaphase2');
    if (!sceneData) return;
    
    // Two cells with separating sister chromatids
    const membrane1 = createCellMembrane(5, 0.15);
    membrane1.position.set(-6, 0, 0);
    membrane1.scale.set(1, 1.2, 1);
    const membrane2 = createCellMembrane(5, 0.15);
    membrane2.position.set(6, 0, 0);
    membrane2.scale.set(1, 1.2, 1);
    sceneData.scene.add(membrane1, membrane2);
    
    // Create single chromatids (no longer paired)
    const createSingleChromatid = (color, glow, position, scale = 0.5) => {
        const chromatid = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.3 * scale, 3 * scale, 8, 16),
            createChromosomeMaterial(color, glow)
        );
        chromatid.position.copy(position);
        return chromatid;
    };
    
    // Cell 1 - separating chromatids
    sceneData.scene.add(createSingleChromatid(0xff6b9d, 0xaa3377, new THREE.Vector3(-7, 2, 0)));
    sceneData.scene.add(createSingleChromatid(0xff6b9d, 0xaa3377, new THREE.Vector3(-7, -2, 0)));
    sceneData.scene.add(createSingleChromatid(0xa855f7, 0x7733bb, new THREE.Vector3(-5, 2, 0)));
    sceneData.scene.add(createSingleChromatid(0xa855f7, 0x7733bb, new THREE.Vector3(-5, -2, 0)));
    
    // Cell 2 - separating chromatids
    sceneData.scene.add(createSingleChromatid(0x00d4ff, 0x0088aa, new THREE.Vector3(5, 2, 0)));
    sceneData.scene.add(createSingleChromatid(0x00d4ff, 0x0088aa, new THREE.Vector3(5, -2, 0)));
    sceneData.scene.add(createSingleChromatid(0x10b981, 0x0a7755, new THREE.Vector3(7, 2, 0)));
    sceneData.scene.add(createSingleChromatid(0x10b981, 0x0a7755, new THREE.Vector3(7, -2, 0)));
    
    sceneData.animateCallback = () => {
        membrane1.rotation.y += 0.002;
        membrane2.rotation.y += 0.002;
    };
    
    enableControls(sceneData);
    startAnimation(sceneData);
    window.meiosisScenes.anaphase2 = sceneData;
}

// Telophase II Scene
function createTelophase2Scene() {
    const sceneData = setupScene('canvas-telophase2');
    if (!sceneData) return;
    
    // Four cells forming
    const cellPositions = [
        new THREE.Vector3(-5, 5, 0),
        new THREE.Vector3(5, 5, 0),
        new THREE.Vector3(-5, -5, 0),
        new THREE.Vector3(5, -5, 0)
    ];
    
    const colors = [
        [0xff6b9d, 0xa855f7],
        [0x00d4ff, 0x10b981],
        [0xff6b9d, 0xa855f7],
        [0x00d4ff, 0x10b981]
    ];
    
    const glows = [
        [0xaa3377, 0x7733bb],
        [0x0088aa, 0x0a7755],
        [0xaa3377, 0x7733bb],
        [0x0088aa, 0x0a7755]
    ];
    
    const membranes = [];
    
    cellPositions.forEach((pos, i) => {
        const membrane = createCellMembrane(3, 0.25);
        membrane.position.copy(pos);
        sceneData.scene.add(membrane);
        membranes.push(membrane);
        
        // Nuclear envelope forming
        const nucleus = new THREE.Mesh(
            new THREE.SphereGeometry(2, 16, 16),
            new THREE.MeshPhongMaterial({
                color: 0x6644ff,
                transparent: true,
                opacity: 0.2,
                side: THREE.DoubleSide,
                emissive: 0x4422aa,
                emissiveIntensity: 0.3
            })
        );
        nucleus.position.copy(pos);
        nucleus.userData.type = 'nucleus';
        sceneData.scene.add(nucleus);
        
        // Two chromosomes per cell - now unwinding
        const chr1 = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.15, 1.5, 8, 16),
            createChromosomeMaterial(colors[i][0], glows[i][0])
        );
        chr1.position.set(pos.x - 0.5, pos.y, pos.z);
        chr1.userData.type = 'chromatid';
        
        const chr2 = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.15, 1.5, 8, 16),
            createChromosomeMaterial(colors[i][1], glows[i][1])
        );
        chr2.position.set(pos.x + 0.5, pos.y, pos.z);
        chr2.userData.type = 'chromatid';
        
        sceneData.scene.add(chr1, chr2);
        
        // Add sparkle effects to show uniqueness
        for (let j = 0; j < 5; j++) {
            const sparkle = new THREE.Mesh(
                new THREE.OctahedronGeometry(0.15, 0),
                new THREE.MeshPhongMaterial({
                    color: 0xffff00,
                    emissive: 0xffaa00,
                    emissiveIntensity: 0.8,
                    transparent: true,
                    opacity: 0.7
                })
            );
            const angle = (j / 5) * Math.PI * 2;
            sparkle.position.set(
                pos.x + Math.cos(angle) * 2.5,
                pos.y + Math.sin(angle) * 2.5,
                0
            );
            sceneData.scene.add(sparkle);
        }
    });
    
    // Add connecting lines to show they came from same cell
    const lineGeometry1 = new THREE.BufferGeometry().setFromPoints([
        cellPositions[0], cellPositions[1]
    ]);
    const lineGeometry2 = new THREE.BufferGeometry().setFromPoints([
        cellPositions[2], cellPositions[3]
    ]);
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x666666,
        transparent: true,
        opacity: 0.3
    });
    sceneData.scene.add(new THREE.Line(lineGeometry1, lineMaterial));
    sceneData.scene.add(new THREE.Line(lineGeometry2, lineMaterial));
    
    sceneData.animateCallback = () => {
        sceneData.scene.rotation.y += 0.002;
        // Make cells pulse slightly
        const pulse = Math.sin(Date.now() * 0.001) * 0.05;
        membranes.forEach((mem, i) => {
            const phase = (i * Math.PI / 2);
            mem.scale.set(
                1 + Math.sin(Date.now() * 0.001 + phase) * 0.05,
                1 + Math.sin(Date.now() * 0.001 + phase) * 0.05,
                1 + Math.sin(Date.now() * 0.001 + phase) * 0.05
            );
        });
    };
    
    enableControls(sceneData);
    startAnimation(sceneData);
    window.meiosisScenes.telophase2 = sceneData;
}

// Initialize all scenes when window loads
window.addEventListener('load', () => {
    setTimeout(() => {
        createHeroScene();
        createInterphaseScene();
        createProphase1Scene();
        createMetaphase1Scene();
        createAnaphase1Scene();
        createTelophase1Scene();
        createCytokinesis1Scene();
        createInterkinesisScene();
        createProphase2Scene();
        createMetaphase2Scene();
        createAnaphase2Scene();
        createTelophase2Scene();
        console.log('🧬 All 3D scenes initialized!');
    }, 100);
});

// Handle window resize
window.addEventListener('resize', () => {
    Object.values(window.meiosisScenes).forEach(sceneData => {
        if (sceneData.container && sceneData.camera && sceneData.renderer) {
            const width = sceneData.container.clientWidth;
            const height = sceneData.container.clientHeight;
            
            sceneData.camera.aspect = width / height;
            sceneData.camera.updateProjectionMatrix();
            sceneData.renderer.setSize(width, height);
        }
    });
});

