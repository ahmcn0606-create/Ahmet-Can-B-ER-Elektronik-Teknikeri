document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // 100x100 segment bükülebilir siber radar düzlemi
    const geometry = new THREE.PlaneGeometry(65, 65, 100, 100);
    
    // Teknolojik tel çerçeve (wireframe) materyali
    const material = new THREE.MeshLambertMaterial({
        color: 0x00ffcc, // Siber Mavi / Turkuaz çizgiler
        wireframe: true,
        side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2.5; // Sahneye askeri radar derinliği katmak için yatırıyoruz
    scene.add(mesh);

    // Işıklandırma (Dinamik gölgeler ve parlamalar için)
    const ambientLight = new THREE.AmbientLight(0x0a0a15);
    scene.add(ambientLight);

    const neonLight1 = new THREE.PointLight(0x00ffcc, 2.5, 60); // Siber Turkuaz Işık
    scene.add(neonLight1);

    const neonLight2 = new THREE.PointLight(0x00ff66, 2.5, 60); // Radar Yeşili Işık
    scene.add(neonLight2);

    // Fare hareket takibi
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.1;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.1;
    });

    let clock = new THREE.Clock();

    // Ana Animasyon Döngüsü
    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();
        const positionAttribute = geometry.attributes.position;

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        // Siber dalgaların matematiksel bükülme hesabı
        for (let i = 0; i < positionAttribute.count; i++) {
            const x = positionAttribute.getX(i);
            const declineY = positionAttribute.getY(i);

            // Fare konumuna ve zamana göre Z ekseninde dalgalanma (Plazma etkisi)
            const z = Math.sin(x * 0.2 + time * 2.0) * Math.cos(declineY * 0.2 + time * 1.5) * 2.5
                      + Math.sin(x + targetX * 0.5) * 0.8; 

            positionAttribute.setZ(i, z);
        }
        
        positionAttribute.needsUpdate = true;

        // Işıkları fare hareketine bağlama
        neonLight1.position.set(targetX, -targetY, 15);
        neonLight2.position.set(-targetX, targetY, 8);

        // Ağın kendi etrafında ağır ve karizmatik dönüşü
        mesh.rotation.z = time * 0.03;

        renderer.render(scene, camera);
    }

    animate();

    // Ekran boyutu değiştiğinde otomatik esnetme
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
