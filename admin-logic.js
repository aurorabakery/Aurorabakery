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
            if (localStorage.getItem('admin_logged') !== 'true') {
                window.location.href = 'login.html';
            }
            this.github.token = localStorage.getItem('gh_token') || '';
            this.loadData();
        },

        loadData() {
            // Cargar Config (Cambiado a aurora_ para limpieza)
            const storedConfig = localStorage.getItem('aurora_config');
            if (storedConfig) {
                this.config = JSON.parse(storedConfig);
            } else if (typeof CONFIG !== 'undefined') {
                this.config = CONFIG;
                localStorage.setItem('aurora_config', JSON.stringify(this.config));
            }

            // Cargar Productos (Cambiado a aurora_ para limpieza)
            const storedProds = localStorage.getItem('aurora_products');
            if (storedProds) {
                this.products = JSON.parse(storedProds);
            } else if (typeof MENU !== 'undefined') {
                this.products = MENU;
                localStorage.setItem('aurora_products', JSON.stringify(this.products));
            }
        },

        addVariant() {
            if (!this.form.variants) this.form.variants = [];
            this.form.variants = [...this.form.variants, { name: '', price: 0 }];
        },

        removeVariant(index) {
            this.form.variants.splice(index, 1);
            this.form.variants = [...this.form.variants];
        },

        addOption() {
            if (!this.form.options) this.form.options = [];
            this.form.options = [...this.form.options, { name: '', price: 0 }];
        },

        removeOption(index) {
            this.form.options.splice(index, 1);
            this.form.options = [...this.form.options];
        },

        get filteredProducts() {
            return this.products.filter(p => {
                const matchesSearch = p.name.toLowerCase().includes(this.search.toLowerCase());
                const matchesCat = this.filterCat === 'all' || p.cat === this.filterCat;
                return matchesSearch && matchesCat;
            });
        },

        countCat(cat) {
            return this.products.filter(p => p.cat === cat).length;
        },

        saveConfig() {
            localStorage.setItem('aurora_config', JSON.stringify(this.config));
            this.showToast('Configuración Guardada', 'El teléfono ha sido actualizado localmente');
        },

        handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            if (file.size > 15 * 1024 * 1024) {
                alert("La imagen es muy pesada. Máximo 15MB.");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.form.image = e.target.result;
            };
            reader.readAsDataURL(file);
        },

        checkNewCat(e) {
            if (e.target.value === 'NEW') {
                const newCat = prompt("Ingresa el nombre de la nueva categoría:");
                if (newCat && newCat.trim() !== '') {
                    const cleanCat = newCat.trim().toLowerCase();
                    if (!this.config.categories.includes(cleanCat)) {
                        this.config.categories.push(cleanCat);
                        localStorage.setItem('aurora_config', JSON.stringify(this.config));
                    }
                    this.form.cat = cleanCat;
                } else {
                    this.form.cat = this.config.categories[0];
                }
            }
        },

        openModal(mode, product = null) {
            this.editMode = mode === 'edit';
            if (this.editMode && product) {
                this.form = JSON.parse(JSON.stringify(product));
                if (!this.form.variants) this.form.variants = [];
                if (!this.form.options) this.form.options = [];
                this.form.options = this.form.options.map(opt =>
                    typeof opt === 'string' ? { name: opt, price: 0 } : opt
                );
            } else {
                this.form = {
                    id: Date.now(),
                    name: '',
                    desc: '',
                    price: '',
                    cat: this.config.categories[0] || '',
                    image: '',
                    variants: [],
                    options: []
                };
            }
            this.showModal = true;
        },

        saveProduct() {
            if (!this.form.name || this.form.name.trim() === '') {
                alert("El nombre es obligatorio.");
                return;
            }

            try {
                const productData = JSON.parse(JSON.stringify(this.form));
                if (!productData.id) productData.id = Date.now();
                productData.price = parseFloat(productData.price) || 0;

                // Limpiar Variantes y Sabores
                if (productData.variants) {
                    productData.variants = productData.variants.filter(v => (v.name || '').trim() !== '').map(v => ({ name: v.name.trim(), price: parseFloat(v.price) || 0 }));
                }
                if (productData.options) {
                    productData.options = productData.options.filter(o => (typeof o === 'string' ? o : o.name).trim() !== '').map(o => ({ name: (typeof o === 'string' ? o : o.name).trim(), price: parseFloat(o.price) || 0 }));
                }

                if (this.editMode) {
                    const idx = this.products.findIndex(p => String(p.id) === String(productData.id));
                    if (idx !== -1) this.products[idx] = productData;
                    else this.products.push(productData);
                } else {
                    this.products.push(productData);
                }

                // Guardar y refrescar
                localStorage.setItem('aurora_products', JSON.stringify(this.products));
                this.products = [...this.products];
                this.showModal = false;
                this.showToast('¡Guardado Local!', 'Haz clic en Publicar para que se vea en la web');

            } catch (err) {
                console.error(err);
                alert("Error al guardar localmente.");
            }
        },

        async publishToGitHub() {
            // Si el token guardado no existe, pedirlo
            if (!this.github.token) {
                const token = prompt("Ingresa tu GitHub Token (ghp_...):");
                if (!token) return;
                this.github.token = token;
                localStorage.setItem('gh_token', token);
            }

            this.showToast('Sincronizando...', 'Subiendo cambios a la nube...');

            try {
                // 1. Obtener SHA del archivo actual
                const res = await fetch(`https://api.github.com/repos/${this.github.repo}/contents/${this.github.path}`, {
                    headers: { 'Authorization': `token ${this.github.token}` }
                });

                if (res.status === 401) {
                    localStorage.removeItem('gh_token');
                    this.github.token = '';
                    alert("El Token es inválido. Por favor, pulsa Publicar de nuevo e ingresa el correcto.");
                    return;
                }

                const fileData = await res.json();

                // 2. Preparar contenido
                const newContent = `const CONFIG = ${JSON.stringify(this.config, null, 2)};\n\nconst MENU = ${JSON.stringify(this.products, null, 2)};\n\nconst GRADIENTS = {};`.trim();
                const encodedContent = btoa(unescape(encodeURIComponent(newContent)));

                // 3. Subir a GitHub
                const updateRes = await fetch(`https://api.github.com/repos/${this.github.repo}/contents/${this.github.path}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${this.github.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: "Update from Aurora Admin",
                        content: encodedContent,
                        sha: fileData.sha,
                        branch: this.github.branch
                    })
                });

                if (updateRes.ok) {
                    this.showToast('¡ÉXITO TOTAL!', 'La web se está actualizando. Espera 30 segundos.');
                } else {
                    const errorJson = await updateRes.json();
                    throw new Error(errorJson.message);
                }
            } catch (err) {
                console.error(err);
                this.showToast('Error de Conexión', 'No se pudo subir. Revisa tu Token.');
            }
        },

        showToast(title, msg) {
            this.toast = { show: true, title, msg };
            setTimeout(() => this.toast.show = false, 4000);
        },

        logout() {
            localStorage.removeItem('admin_logged');
            window.location.href = 'login.html';
        }
    }
}
