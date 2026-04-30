function adminPanel() {
    return {
        products: [],
        config: { phone: '', categories: [] },
        search: '',
        filterCat: 'all',
        showModal: false,
        editMode: false,
        form: { id: null, name: '', desc: '', price: '', cat: '', image: '', variants: [], options: [] },
        toast: { show: false, title: '', msg: '' },

        github: {
            token: '',
            repo: 'aurorabakery/Aurorabakery', // ASEGÚRATE DE QUE ESTE SEA TU REPO
            path: 'js/data.js',
            branch: 'main'
        },

        init() {
            if (localStorage.getItem('admin_logged') !== 'true') window.location.href = 'login.html';
            this.github.token = localStorage.getItem('gh_token') || '';
            this.loadData();
        },

        loadData() {
            const storedConfig = localStorage.getItem('aurora_config_v2');
            this.config = storedConfig ? JSON.parse(storedConfig) : CONFIG;
            const storedProds = localStorage.getItem('aurora_products_v2');
            this.products = storedProds ? JSON.parse(storedProds) : (typeof MENU !== 'undefined' ? MENU : []);
        },

        handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width, height = img.height;
                    const MAX = 800;
                    if (width > height) { if (width > MAX) { height *= MAX / width; width = MAX; } }
                    else { if (height > MAX) { width *= MAX / height; height = MAX; } }
                    canvas.width = width; canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    // Comprimimos para que no pese nada
                    this.form.image = canvas.toDataURL('image/jpeg', 0.7);
                    this.showToast('Imagen Lista', 'Se optimizó para ser ligera.');
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        },

        saveProduct() {
            if (!this.form.name) return alert("Nombre obligatorio");
            const productData = JSON.parse(JSON.stringify(this.form));
            if (!productData.id) productData.id = Date.now();

            if (this.editMode) {
                const idx = this.products.findIndex(p => String(p.id) === String(productData.id));
                if (idx !== -1) this.products[idx] = productData;
            } else {
                this.products.push(productData);
            }

            localStorage.setItem('aurora_products_v2', JSON.stringify(this.products));
            this.showModal = false;
            this.showToast('Guardado Local', 'Presiona Publicar para subir fotos y datos.');
        },

        async publishToGitHub() {
            if (!this.github.token) {
                const t = prompt("Token de GitHub:");
                if (!t) return;
                this.github.token = t;
                localStorage.setItem('gh_token', t);
            }

            this.showToast('Sincronizando...', 'Subiendo archivos a GitHub (Estilo Elite)...');

            try {
                // 1. PROCESAR IMÁGENES (Subirlas como archivos individuales si son nuevas)
                for (let p of this.products) {
                    if (p.image && p.image.startsWith('data:image')) {
                        const fileName = `fotos-productos/prod-${p.id}.jpg`;
                        const base64Content = p.image.split(',')[1];

                        // Intentar ver si ya existe para obtener el SHA
                        let sha = null;
                        const checkFile = await fetch(`https://api.github.com/repos/${this.github.repo}/contents/${fileName}`, {
                            headers: { 'Authorization': `token ${this.github.token}` }
                        });
                        if (checkFile.ok) {
                            const checkData = await checkFile.json();
                            sha = checkData.sha;
                        }

                        // Subir imagen a GitHub
                        await fetch(`https://api.github.com/repos/${this.github.repo}/contents/${fileName}`, {
                            method: 'PUT',
                            headers: { 'Authorization': `token ${this.github.token}`, 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                message: `📸 Subir foto: ${p.name}`,
                                content: base64Content,
                                sha: sha
                            })
                        });

                        // Reemplazar Base64 por la ruta del archivo (IGUAL QUE EN ELITE)
                        p.image = fileName;
                    }
                }

                // 2. ACTUALIZAR DATA.JS (Ahora será pequeñito porque no tiene las fotos dentro)
                const res = await fetch(`https://api.github.com/repos/${this.github.repo}/contents/${this.github.path}`, {
                    headers: { 'Authorization': `token ${this.github.token}` }
                });
                const fileData = await res.json();

                const newContent = `const CONFIG = ${JSON.stringify(this.config, null, 2)};\n\nconst MENU = ${JSON.stringify(this.products, null, 2)};\n\nconst GRADIENTS = {};`;

                const updateRes = await fetch(`https://api.github.com/repos/${this.github.repo}/contents/${this.github.path}`, {
                    method: 'PUT',
                    headers: { 'Authorization': `token ${this.github.token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: "📦 Actualización de catálogo (Fotos separadas)",
                        content: btoa(unescape(encodeURIComponent(newContent))),
                        sha: fileData.sha
                    })
                });

                if (updateRes.ok) {
                    localStorage.setItem('aurora_products_v2', JSON.stringify(this.products));
                    this.showToast('¡ÉXITO TOTAL!', 'Fotos y datos guardados por separado.');
                }
            } catch (err) {
                console.error(err);
                alert("Error al conectar. Revisa tu Token y el nombre del Repositorio.");
            }
        },

        saveConfig() {
            this.config.phone = this.config.phone.replace(/\D/g, '');
            localStorage.setItem('aurora_config_v2', JSON.stringify(this.config));
            this.showToast('Configuración Guardada', 'Pulsa Publicar.');
        },

        showToast(title, msg) {
            this.toast = { show: true, title, msg };
            setTimeout(() => this.toast.show = false, 3000);
        },

        logout() {
            localStorage.removeItem('admin_logged');
            window.location.href = 'login.html';
        }
    }
}
