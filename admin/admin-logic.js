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
            repo: 'aurorabakery/Aurorabakery',
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
            this.config = storedConfig ? JSON.parse(storedConfig) : (typeof CONFIG !== 'undefined' ? CONFIG : { phone: '', categories: ['Pastelería', 'Dulces'] });
            const storedProds = localStorage.getItem('aurora_products_v2');
            this.products = storedProds ? JSON.parse(storedProds) : (typeof MENU !== 'undefined' ? MENU : []);
        },

        get filteredProducts() {
            return this.products.filter(p => {
                const matchSearch = p.name.toLowerCase().includes(this.search.toLowerCase());
                const matchCat = this.filterCat === 'all' || p.cat === this.filterCat;
                return matchSearch && matchCat;
            });
        },

        countCat(cat) {
            return this.products.filter(p => p.cat === cat).length;
        },

        openModal(mode, product = null) {
            this.editMode = mode === 'edit';
            if (this.editMode && product) {
                this.form = JSON.parse(JSON.stringify(product));
            } else {
                this.form = { id: null, name: '', desc: '', price: '', cat: this.config.categories[0], image: '', variants: [], options: [] };
            }
            this.showModal = true;
        },

        checkNewCat(e) {
            if (e.target.value === 'NEW') {
                const name = prompt("Nombre de la nueva categoría:");
                if (name) {
                    this.config.categories.push(name);
                    this.form.cat = name;
                } else {
                    this.form.cat = this.config.categories[0];
                }
            }
        },

        addVariant() { this.form.variants.push({ name: '', price: '' }); },
        removeVariant(index) { this.form.variants.splice(index, 1); },
        addOption() { this.form.options.push({ name: '', price: '' }); },
        removeOption(index) { this.form.options.splice(index, 1); },

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
                    this.form.image = canvas.toDataURL('image/jpeg', 0.7);
                    this.showToast('Imagen Lista', 'Optimizada para ser ligera.');
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        },

        saveProduct() {
            const pData = JSON.parse(JSON.stringify(this.form));
            if (!pData.id) pData.id = Date.now();

            if (this.editMode) {
                const idx = this.products.findIndex(p => String(p.id) === String(pData.id));
                if (idx !== -1) this.products[idx] = pData;
            } else {
                this.products.push(pData);
            }

            localStorage.setItem('aurora_products_v2', JSON.stringify(this.products));
            this.showModal = false;
            this.showToast('Guardado Local', 'Recuerda pulsar "Publicar Cambios".');
        },

        deleteProduct(id) {
            if (confirm('¿Eliminar este producto?')) {
                this.products = this.products.filter(p => p.id !== id);
                localStorage.setItem('aurora_products_v2', JSON.stringify(this.products));
            }
        },

        async publishToGitHub() {
            if (!this.github.token) {
                const t = prompt("Token de GitHub:");
                if (!t) return;
                this.github.token = t;
                localStorage.setItem('gh_token', t);
            }

            this.showToast('Sincronizando...', 'Subiendo fotos y datos a GitHub...');

            try {
                for (let p of this.products) {
                    if (p.image && p.image.startsWith('data:image')) {
                        const fileName = `fotos-productos/prod-${p.id}.jpg`;
                        const base64Content = p.image.split(',')[1];
                        let sha = null;
                        const check = await fetch(`https://api.github.com/repos/${this.github.repo}/contents/${fileName}`, {
                            headers: { 'Authorization': `token ${this.github.token}` }
                        });
                        if (check.ok) { const data = await check.json(); sha = data.sha; }

                        await fetch(`https://api.github.com/repos/${this.github.repo}/contents/${fileName}`, {
                            method: 'PUT',
                            headers: { 'Authorization': `token ${this.github.token}` },
                            body: JSON.stringify({ message: `📸 Foto: ${p.name}`, content: base64Content, sha: sha })
                        });
                        p.image = fileName;
                    }
                }

                const res = await fetch(`https://api.github.com/repos/${this.github.repo}/contents/${this.github.path}`, {
                    headers: { 'Authorization': `token ${this.github.token}` }
                });
                const fileData = await res.json();
                const newContent = `const CONFIG = ${JSON.stringify(this.config, null, 2)};\n\nconst MENU = ${JSON.stringify(this.products, null, 2)};\n\nconst GRADIENTS = { 'default': 'linear-gradient(135deg, #c65b7c 0%, #3d1e26 100%)' };`;

                await fetch(`https://api.github.com/repos/${this.github.repo}/contents/${this.github.path}`, {
                    method: 'PUT',
                    headers: { 'Authorization': `token ${this.github.token}` },
                    body: JSON.stringify({
                        message: "📦 Catálogo Actualizado",
                        content: btoa(unescape(encodeURIComponent(newContent))),
                        sha: fileData.sha
                    })
                });

                this.showToast('¡ÉXITO!', 'Todo guardado en GitHub.');
            } catch (err) { alert("Error al publicar. Verifica tu Token."); }
        },

        saveConfig() {
            this.config.phone = this.config.phone.replace(/\D/g, '');
            localStorage.setItem('aurora_config_v2', JSON.stringify(this.config));
            this.showToast('Ajustes Guardados', 'Listo.');
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
