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
            this.loadData();
            this.github.token = localStorage.getItem('gh_token') || '';
        },

        loadData() {
            // Cargar Config
            const storedConfig = localStorage.getItem('elite_config');
            if (storedConfig) {
                this.config = JSON.parse(storedConfig);
            } else if (typeof CONFIG !== 'undefined') {
                this.config = CONFIG;
                localStorage.setItem('elite_config', JSON.stringify(this.config));
            }

            // Cargar Productos
            const storedProds = localStorage.getItem('elite_products');
            if (storedProds) {
                this.products = JSON.parse(storedProds);
            } else if (typeof MENU !== 'undefined') {
                this.products = MENU;
                localStorage.setItem('elite_products', JSON.stringify(this.products));
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
            localStorage.setItem('elite_config', JSON.stringify(this.config));
            this.showToast('Configuración Guardada', 'El teléfono ha sido actualizado localmente');
        },

        handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            // Validar tamaño (máximo 15MB para fotos de alta calidad)
            if (file.size > 15 * 1024 * 1024) {
                alert("La imagen es muy pesada. Máximo 15MB.");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.form.image = e.target.result; // Esto guarda la imagen en Base64
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
                        localStorage.setItem('elite_config', JSON.stringify(this.config));
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
                this.form = JSON.parse(JSON.stringify(product)); // Deep clone
                if (!this.form.variants) this.form.variants = [];
                if (!this.form.options) this.form.options = [];

                // Normalizar opciones a objetos si vienen como strings
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
                    emoji: '✨',
                    variants: [],
                    options: []
                };
            }
            this.showModal = true;
        },

        saveProduct() {
            console.log("Intentando guardar producto...");

            if (!this.form.name || this.form.name.trim() === '') {
                alert("El nombre del producto es obligatorio.");
                return;
            }

            try {
                // Crear copia limpia de los datos
                const productData = JSON.parse(JSON.stringify(this.form));

                if (!productData.id) productData.id = Date.now();
                productData.price = parseFloat(productData.price) || 0;

                // Limpiar Variantes
                if (productData.variants) {
                    productData.variants = productData.variants
                        .map(v => ({
                            name: (v.name || '').trim(),
                            price: parseFloat(v.price) || 0
                        }))
                        .filter(v => v.name !== '');
                }

                // Limpiar Sabores
                if (productData.options) {
                    productData.options = productData.options
                        .map(o => ({
                            name: (typeof o === 'string' ? o : (o.name || '')).trim(),
                            price: typeof o === 'string' ? 0 : (parseFloat(o.price) || 0)
                        }))
                        .filter(o => o.name !== '');
                }

                // Actualizar lista principal
                if (this.editMode) {
                    const idx = this.products.findIndex(p => String(p.id) === String(productData.id));
                    if (idx !== -1) {
                        this.products[idx] = productData;
                    } else {
                        this.products.push(productData);
                    }
                } else {
                    this.products.push(productData);
                }

                // Intentar guardar en LocalStorage (con manejo de cuota)
                try {
                    localStorage.setItem('elite_products', JSON.stringify(this.products));
                } catch (e) {
                    if (e.name === 'QuotaExceededError') {
                        alert("⚠️ La imagen es demasiado pesada para la vista previa, pero se guardará definitivamente cuando hagas clic en 'Publicar Cambios'.");
                    }
                }

                this.showModal = false;
                this.showToast('¡Guardado!', 'Receta lista para publicar');

                // Forzar refresco de la lista en Alpine
                this.products = [...this.products];

            } catch (err) {
                console.error("Error crítico al guardar:", err);
                alert("Ocurrió un error al procesar los datos. Por favor intenta de nuevo.");
            }
        },

        deleteProduct(id) {
            if (confirm('¿Eliminar este producto?')) {
                this.products = this.products.filter(p => p.id !== id);
                localStorage.setItem('elite_products', JSON.stringify(this.products));
                this.showToast('Eliminado', 'Producto borrado');
            }
        },

        async publishToGitHub() {
            if (!this.github.token) {
                const token = prompt("Ingresa tu GitHub Token:");
                if (!token) return;
                this.github.token = token;
                localStorage.setItem('gh_token', token);
            }

            this.showToast('Publicando...', 'Sincronizando catálogo y configuración...');

            try {
                const res = await fetch(`https://api.github.com/repos/${this.github.repo}/contents/${this.github.path}`, {
                    headers: { 'Authorization': `token ${this.github.token}` }
                });
                const fileData = await res.json();

                // Generar contenido del archivo js/data.js incluyendo CONFIG y MENU
                const newContent = `
const CONFIG = ${JSON.stringify(this.config, null, 2)};

const MENU = ${JSON.stringify(this.products, null, 2)};

const GRADIENTS = {}; // Mantener si es necesario
                `.trim();

                const encodedContent = btoa(unescape(encodeURIComponent(newContent)));

                const updateRes = await fetch(`https://api.github.com/repos/${this.github.repo}/contents/${this.github.path}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${this.github.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: "Update Catalog & Config from Admin",
                        content: encodedContent,
                        sha: fileData.sha,
                        branch: this.github.branch
                    })
                });

                if (updateRes.ok) {
                    this.showToast('¡Éxito!', 'Catálogo y teléfono actualizados en la web');
                } else {
                    throw new Error('Error al actualizar');
                }
            } catch (err) {
                console.error(err);
                this.showToast('Error', 'No se pudo publicar. Revisa tu Token.');
            }
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
