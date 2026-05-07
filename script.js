// ===========================================
// BASIT MEME OLUŞTURUCU (index.html için)
// ===========================================

// URL parametrelerini al
const urlParams = new URLSearchParams(window.location.search);
const textParam = urlParams.get('text') || 'Merhaba Dünya!';

// Basit meme oluşturucu için fonksiyonlar
function initSimpleMeme() {
    // Canvas ve context
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Input elementleri
    const textInput = document.getElementById('textInput');
    const fontSizeInput = document.getElementById('fontSizeInput');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const colorInput = document.getElementById('colorInput');
    const generatedUrl = document.getElementById('generatedUrl');

    if (!canvas || !textInput) return; // Bu sayfa için değil

    // Başlangıç değerleri
    textInput.value = textParam;
    updateCanvas();
    updateUrl();

    // Event listeners
    textInput.addEventListener('input', () => {
        updateCanvas();
        updateUrl();
    });

    fontSizeInput.addEventListener('input', () => {
        fontSizeValue.textContent = fontSizeInput.value + 'px';
        updateCanvas();
        updateUrl();
    });

    colorInput.addEventListener('input', () => {
        updateCanvas();
        updateUrl();
    });

    function updateCanvas() {
        const text = textInput.value || 'Merhaba Dünya!';
        const fontSize = parseInt(fontSizeInput.value);
        const color = colorInput.value;

        // Canvas'ı temizle
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Gradient arka plan
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Metin ayarları
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Metin gölgesi
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Metni çiz (çok satırlı destek)
        const lines = text.split('\n');
        const lineHeight = fontSize * 1.2;
        const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;

        lines.forEach((line, index) => {
            ctx.fillText(line, canvas.width / 2, startY + (index * lineHeight));
        });
    }

    function updateUrl() {
        const text = encodeURIComponent(textInput.value || 'Merhaba Dünya!');
        const fontSize = fontSizeInput.value;
        const color = encodeURIComponent(colorInput.value);

        const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '').replace('dinamik-meme-olusturucu.html', '');

        // Temel parametreler
        const baseParams = `text=${text}&size=${fontSize}&color=${color}`;

        // Sadece PNG URL'ini göster
        const pngUrl = `${baseUrl}resim.png?${baseParams}`;

        // URL'yi global değişkene kaydet
        window.currentDynamicUrl = pngUrl;

        generatedUrl.innerHTML = `
            <div style="margin: 5px 0; padding: 10px; background: white; border-radius: 5px; border: 1px solid #ddd;">
                <strong style="color: #667eea;">📸 Görsel URL:</strong><br>
                <code style="word-break: break-all; font-size: 12px; color: #555;">${pngUrl}</code>
            </div>
            <div style="margin-top: 10px; padding: 8px; background: #e3f2fd; border-radius: 3px; font-size: 12px;">
                💡 <strong>İpucu:</strong> Gelişmiş meme oluşturmak için <a href="create-static-image.html" style="color: #667eea;">Meme Oluşturucu</a>'yu kullanın!
            </div>
        `;
    }
}

// Copy dynamic URL to clipboard
window.copyDynamicUrl = async function() {
    try {
        const url = window.currentDynamicUrl;
        if (!url) {
            alert('❌ Henüz URL oluşturulmadı!');
            return;
        }

        await navigator.clipboard.writeText(url);
        
        const button = event.target;
        const originalText = button.innerHTML;
        const originalBg = button.style.background;
        
        button.innerHTML = '✅ Kopyalandı!';
        button.style.background = '#28a745';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = originalBg;
        }, 2000);
        
    } catch (err) {
        console.error('Kopyalama hatası:', err);
        const url = window.currentDynamicUrl;
        prompt('Bu URL\'yi manuel olarak kopyalayın:', url);
    }
}

// ===========================================
// GELİŞMİŞ MEME OLUŞTURUCU (create-static-image.html için)
// ===========================================

function initAdvancedMeme() {
    // DOM Elements
    const canvas = document.getElementById('canvas');
    if (!canvas) return; // Bu sayfa için değil

    const ctx = canvas.getContext('2d');
    const fontSizeInput = document.getElementById('fontSizeInput');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const colorInput = document.getElementById('colorInput');
    const customImageUrl = document.getElementById('customImageUrl');
    const fontFamily = document.getElementById('fontFamily');
    const fontWeight = document.getElementById('fontWeight');
    const textX = document.getElementById('textX');
    const textY = document.getElementById('textY');
    const textXValue = document.getElementById('textXValue');
    const textYValue = document.getElementById('textYValue');
    const shadowBlur = document.getElementById('shadowBlur');
    const shadowOffset = document.getElementById('shadowOffset');
    const shadowBlurValue = document.getElementById('shadowBlurValue');
    const shadowOffsetValue = document.getElementById('shadowOffsetValue');
    const shadowColor = document.getElementById('shadowColor');
    const memeSearch = document.getElementById('memeSearch');
    const memeDropdown = document.getElementById('memeDropdown');
    const memeLoading = document.getElementById('memeLoading');
    const githubImageSearch = document.getElementById('githubImageSearch');
    const githubDropdown = document.getElementById('githubDropdown');
    const githubLoading = document.getElementById('githubLoading');

    // State
    let currentUrl = '';
    let backgroundImage = null;
    let selectedImageUrl = '';
    let memeTemplates = [];
    let selectedMeme = null;
    let textBoxes = [];
    let activeTextBoxId = 0;
    let textBoxCounter = 0;

    // Popüler meme template'leri (imgflip.com'dan)
    const popularMemes = [
        { id: '181913649', name: 'Drake Pointing', url: 'https://i.imgflip.com/30b1gx.jpg' },
        { id: '87743020', name: 'Two Buttons', url: 'https://i.imgflip.com/1g8my4.jpg' },
        { id: '112126428', name: 'Distracted Boyfriend', url: 'https://i.imgflip.com/1ur9b0.jpg' },
        { id: '131087935', name: 'Running Away Balloon', url: 'https://i.imgflip.com/261o3j.jpg' },
        { id: '4087833', name: 'Waiting Skeleton', url: 'https://i.imgflip.com/2fm6x.jpg' },
        { id: '61579', name: 'One Does Not Simply', url: 'https://i.imgflip.com/1bij.jpg' },
        { id: '101470', name: 'Ancient Aliens', url: 'https://i.imgflip.com/26am.jpg' },
        { id: '80707627', name: 'Sad Pablo Escobar', url: 'https://i.imgflip.com/1c1uej.jpg' },
        { id: '178591752', name: 'Tuxedo Winnie The Pooh', url: 'https://i.imgflip.com/2ybua0.jpg' },
        { id: '27813981', name: 'Hide the Pain Harold', url: 'https://i.imgflip.com/gk5el.jpg' },
        { id: '124822590', name: 'Left Exit 12 Off Ramp', url: 'https://i.imgflip.com/22bdq6.jpg' },
        { id: '129242436', name: 'Change My Mind', url: 'https://i.imgflip.com/24y43o.jpg' },
        { id: '222403160', name: 'Bernie I Am Once Again Asking For Your Support', url: 'https://i.imgflip.com/3oevdk.jpg' },
        { id: '91538330', name: 'X, X Everywhere', url: 'https://i.imgflip.com/1ihzfe.jpg' },
        { id: '102156234', name: 'Mocking Spongebob', url: 'https://i.imgflip.com/1otk96.jpg' },
        { id: '93895088', name: 'Expanding Brain', url: 'https://i.imgflip.com/1jwhww.jpg' },
        { id: '135256802', name: 'Epic Handshake', url: 'https://i.imgflip.com/28j0te.jpg' },
        { id: '114585149', name: 'Inhaling Seagull', url: 'https://i.imgflip.com/1w7ygt.jpg' },
        { id: '161865971', name: 'Marked Safe From', url: 'https://i.imgflip.com/2odckz.jpg' },
        { id: '97984', name: 'Disaster Girl', url: 'https://i.imgflip.com/23ls.jpg' }
    ];

    // Initialize
    async function init() {
        // Meme template'leri arka planda yükle
        loadMemeTemplates().catch(console.error);

        initializeTextBoxes();
        updatePositionValues();
        updateEffectValues();
        updatePreview();
    }

    // Initialize text boxes
    function initializeTextBoxes() {
        // İlk metin kutusunu ekle
        addTextBox('Üst Metin', 400, 100);
        addTextBox('Alt Metin', 400, 300);
    }

    // Add new text box
    window.addTextBox = function (defaultText = '', defaultX = 400, defaultY = 200) {
        const id = textBoxCounter++;
        const textBox = {
            id: id,
            text: defaultText || `Metin ${id + 1}`,
            x: defaultX,
            y: defaultY,
            fontSize: 40,
            color: '#ffffff',
            font: 'Impact',
            weight: '900',
            shadowBlur: 4,
            shadowOffset: 2,
            shadowColor: '#000000',
            visible: true
        };

        textBoxes.push(textBox);
        renderTextBoxes();
        setActiveTextBox(id);
        updatePreview();
    }

    // Remove text box
    window.removeTextBox = function (id) {
        if (textBoxes.length <= 1) {
            alert('En az bir metin kutusu olmalı!');
            return;
        }

        const boxIndex = textBoxes.findIndex(box => box.id === id);
        if (boxIndex === -1) return;

        textBoxes.splice(boxIndex, 1);

        // Aktif kutu silinmişse, bir sonraki veya önceki kutuyu aktif yap
        if (activeTextBoxId === id) {
            if (textBoxes.length > boxIndex) {
                activeTextBoxId = textBoxes[boxIndex].id;
            } else if (boxIndex > 0) {
                activeTextBoxId = textBoxes[boxIndex - 1].id;
            } else {
                activeTextBoxId = textBoxes[0]?.id || 0;
            }
        }

        renderTextBoxes();
        updateControlsFromActiveBox();
        updatePreview();
    }

    // Set active text box
    window.setActiveTextBox = function (id) {
        updateActiveBoxFromControls();
        activeTextBoxId = id;
        renderTextBoxes();
        updateControlsFromActiveBox();
    }

    // Update controls from active text box
    function updateControlsFromActiveBox() {
        const activeBox = textBoxes.find(box => box.id === activeTextBoxId);
        if (!activeBox) return;

        fontSizeInput.value = activeBox.fontSize;
        fontSizeValue.textContent = activeBox.fontSize + 'px';
        colorInput.value = activeBox.color;
        fontFamily.value = activeBox.font;
        fontWeight.value = activeBox.weight;
        textX.value = activeBox.x;
        textY.value = activeBox.y;
        textXValue.textContent = activeBox.x + 'px';
        textYValue.textContent = activeBox.y + 'px';
        shadowBlur.value = activeBox.shadowBlur;
        shadowOffset.value = activeBox.shadowOffset;
        shadowBlurValue.textContent = activeBox.shadowBlur + 'px';
        shadowOffsetValue.textContent = activeBox.shadowOffset + 'px';
        shadowColor.value = activeBox.shadowColor;
    }

    // Update active text box from controls
    function updateActiveBoxFromControls() {
        const activeBox = textBoxes.find(box => box.id === activeTextBoxId);
        if (!activeBox) return;

        activeBox.fontSize = parseInt(fontSizeInput.value);
        activeBox.color = colorInput.value;
        activeBox.font = fontFamily.value;
        activeBox.weight = fontWeight.value;
        activeBox.x = parseInt(textX.value);
        activeBox.y = parseInt(textY.value);
        activeBox.shadowBlur = parseInt(shadowBlur.value);
        activeBox.shadowOffset = parseInt(shadowOffset.value);
        activeBox.shadowColor = shadowColor.value;
    }

    // Render text boxes
    function renderTextBoxes() {
        const container = document.getElementById('textBoxes');
        container.innerHTML = '';

        textBoxes.forEach((box, index) => {
            const isActive = box.id === activeTextBoxId;
            const displayIndex = index + 1;
            const boxHtml = `
                <div class="text-box ${isActive ? 'active' : ''}" onclick="setActiveTextBox(${box.id})">
                    <div class="position-preview">X:${box.x} Y:${box.y}</div>
                    <div class="text-box-header">
                        <div class="text-box-title">📝 Metin ${displayIndex}</div>
                        <div class="text-box-controls">
                            <button class="btn-mini btn-info" onclick="event.stopPropagation(); toggleTextBoxVisibility(${box.id})" title="Görünürlük">
                                ${box.visible ? '👁️' : '🙈'}
                            </button>
                            <button class="btn-mini btn-danger" onclick="event.stopPropagation(); removeTextBox(${box.id})" title="Sil">
                                🗑️
                            </button>
                        </div>
                    </div>
                    <div class="text-box-content">
                        <textarea 
                            class="form-textarea" 
                            rows="2" 
                            placeholder="Metin içeriği..."
                            onchange="updateTextBoxText(${box.id}, this.value)"
                            oninput="updateTextBoxText(${box.id}, this.value)"
                            onclick="event.stopPropagation()"
                        >${box.text}</textarea>
                        <div class="form-row">
                            <div>
                                <label class="form-label" style="font-size: 11px;">Font: ${box.font}</label>
                            </div>
                            <div>
                                <label class="form-label" style="font-size: 11px;">Boyut: ${box.fontSize}px</label>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += boxHtml;
        });
    }

    // Update text box text
    window.updateTextBoxText = function (id, text) {
        const box = textBoxes.find(box => box.id === id);
        if (box) {
            box.text = text;
            updatePreview();
        }
    }

    // Toggle text box visibility
    window.toggleTextBoxVisibility = function (id) {
        const box = textBoxes.find(box => box.id === id);
        if (box) {
            box.visible = !box.visible;
            renderTextBoxes();
            updatePreview();
        }
    }

    // Load meme templates
    async function loadMemeTemplates() {
        try {
            const response = await fetch('https://api.imgflip.com/get_memes');
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data && data.data.memes) {
                    const apiMemes = data.data.memes.slice(0, 50).map(meme => ({
                        id: meme.id,
                        name: meme.name,
                        url: meme.url,
                        width: meme.width,
                        height: meme.height,
                        box_count: meme.box_count
                    }));
                    memeTemplates = apiMemes;
                } else {
                    throw new Error('API response format hatası');
                }
            } else {
                throw new Error(`API isteği başarısız: ${response.status}`);
            }
        } catch (error) {
            console.warn('Imgflip API hatası, yerel template\'ler kullanılıyor:', error);
            memeTemplates = popularMemes;
        }
        renderMemeDropdown();
    }

    // Render meme dropdown
    function renderMemeDropdown() {
        let html = `
            <div style="padding: 12px; background: #f8f9fa; border-bottom: 1px solid #e1e5e9; font-weight: 600; color: #333;">
                🔥 Popüler Meme Template'leri (${memeTemplates.length} adet)
            </div>
            <div class="meme-option" onclick="selectMeme(null)">
                <div class="meme-thumb" style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 8px;"></div>
                <div class="meme-info">
                    <div class="meme-name">🎨 Gradient Arka Plan</div>
                    <div class="meme-id">Varsayılan</div>
                </div>
            </div>
        `;

        memeTemplates.forEach(meme => {
            const dimensions = meme.width && meme.height ? `${meme.width}x${meme.height}` : '';
            const boxInfo = meme.box_count ? `${meme.box_count} metin kutusu` : '';
            const subtitle = [dimensions, boxInfo].filter(Boolean).join(' • ') || `ID: ${meme.id}`;

            html += `
                <div class="meme-option" onclick="selectMeme('${meme.id}')">
                    <img class="meme-thumb" src="${meme.url}" alt="${meme.name}" loading="lazy"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="meme-thumb" style="display: none; background: #f0f0f0; align-items: center; justify-content: center; color: #999; font-size: 12px;">
                        🖼️
                    </div>
                    <div class="meme-info">
                        <div class="meme-name">${meme.name}</div>
                        <div class="meme-id">${subtitle}</div>
                    </div>
                </div>
            `;
        });

        memeDropdown.innerHTML = html;
    }

    // Toggle meme dropdown
    window.toggleMemeDropdown = function () {
        memeDropdown.classList.toggle('show');
        if (memeDropdown.classList.contains('show') && memeTemplates.length === 0) {
            memeDropdown.innerHTML = '<div class="loading">🔄 Imgflip\'ten popüler meme\'ler yükleniyor...</div>';
        }
    }

    // Toggle GitHub dropdown
    window.toggleGithubDropdown = function () {
        githubDropdown.classList.toggle('show');
        if (githubDropdown.classList.contains('show')) {
            loadGithubImages();
        }
    }

    // Load GitHub images
    async function loadGithubImages() {
        githubDropdown.innerHTML = '<div class="loading">📂 GitHub images/ klasörü taranıyor...</div>';
        try {
            const githubImages = await scanImagesDirectory();
            setTimeout(() => {
                renderGithubDropdown(githubImages);
            }, 200);
        } catch (error) {
            console.error('GitHub images yüklenirken hata:', error);
            renderGithubDropdown([]);
        }
    }

    // Scan images directory
    async function scanImagesDirectory() {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
        const foundImages = [];

        try {
            const hostname = window.location.hostname;
            const pathname = window.location.pathname;

            if (hostname.includes('github.io')) {
                const repoOwner = hostname.split('.')[0];
                const pathParts = pathname.split('/').filter(p => p);
                const repoName = pathParts[0] || repoOwner;

                const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/contents/images`;
                const response = await fetch(apiUrl);

                if (response.ok) {
                    const files = await response.json();
                    files.forEach(file => {
                        if (file.type === 'file') {
                            const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
                            if (imageExtensions.includes(extension)) {
                                foundImages.push({
                                    name: file.name,
                                    url: `contents/images/${file.name}`,
                                    path: file.path,
                                    type: extension.substring(1),
                                    size: file.size
                                });
                            }
                        }
                    });
                    return foundImages;
                } else {
                    throw new Error(`GitHub API hatası: ${response.status}`);
                }
            } else {
                return await scanLocalImages();
            }
        } catch (error) {
            console.warn('GitHub API kullanılamıyor, yerel tarama yapılıyor:', error);
            return await scanLocalImages();
        }
    }

    // Scan local images
    async function scanLocalImages() {
        const foundImages = [];
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
        const knownFiles = ['Ekran görüntüsü 2025-07-24 121904.jpg'];
        const commonNames = ['image', 'photo', 'meme', 'template', 'background', 'bg', '1', '2', '3', '4', '5', 'test', 'sample', 'example'];

        const allPossibleFiles = [...knownFiles];
        commonNames.forEach(name => {
            imageExtensions.forEach(ext => {
                allPossibleFiles.push(`${name}.${ext}`);
            });
        });

        for (const fileName of allPossibleFiles) {
            try {
                const testUrl = `contents/images/${fileName}`;
                const response = await fetch(testUrl, { method: 'HEAD' });
                if (response.ok) {
                    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.') + 1);
                    const alreadyExists = foundImages.some(img => img.name === fileName);
                    if (!alreadyExists) {
                        foundImages.push({
                            name: fileName,
                            url: testUrl,
                            path: `contents/images/${fileName}`,
                            type: extension,
                            size: response.headers.get('content-length') || 'Bilinmiyor'
                        });
                    }
                }
            } catch (error) {
                // Sessizce devam et
            }
        }
        return foundImages;
    }

    // Render GitHub dropdown
    function renderGithubDropdown(githubImages) {
        let html = '';
        if (githubImages.length === 0) {
            html = '<div class="loading">📂 contents/images/ klasöründe resim bulunamadı</div>';
        } else {
            html += `
                <div style="padding: 12px; background: #f8f9fa; border-bottom: 1px solid #e1e5e9; font-weight: 600; color: #333;">
                    📁 Repo Resimleri (${githubImages.length} dosya)
                </div>
            `;
            githubImages.forEach(image => {
                const fileIcon = getFileIcon(image.type || 'unknown');
                html += `
                    <div class="meme-option" onclick="selectGithubImage('${image.url}', '${image.name}')">
                        <img class="meme-thumb" src="${image.url}" alt="${image.name}" loading="lazy" 
                             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZjBmMGYwIi8+CjxwYXRoIGQ9Ik0yNSAxNUMyMC41ODE3IDE1IDE3IDE4LjU4MTcgMTcgMjNDMTcgMjcuNDE4MyAyMC41ODE3IDMxIDI1IDMxQzI5LjQxODMgMzEgMzMgMjcuNDE4MyAzMyAyM0MzMyAxOC41ODE3IDI5LjQxODMgMTUgMjUgMTVaIiBmaWxsPSIjY2NjIi8+Cjwvc3ZnPgo='">
                        <div class="meme-info">
                            <div class="meme-name">${fileIcon} ${image.name}</div>
                            <div class="meme-id">📁 contents/images/</div>
                        </div>
                    </div>
                `;
            });
        }
        githubDropdown.innerHTML = html;
    }

    // Get file icon
    function getFileIcon(type) {
        const icons = {
            'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🎞️',
            'webp': '🖼️', 'svg': '🎨', 'unknown': '📄'
        };
        return icons[type.toLowerCase()] || icons.unknown;
    }

    // Select meme template
    window.selectMeme = function (memeId) {
        if (!memeId) {
            selectedMeme = null;
            backgroundImage = null;
            memeSearch.value = 'Gradient Arka Plan';
        } else {
            const meme = memeTemplates.find(m => m.id === memeId);
            if (meme) {
                selectedMeme = meme;
                memeSearch.value = meme.name;
                loadBackgroundImage(meme.url);
            }
        }
        memeDropdown.classList.remove('show');
        updatePreview();
    }

    // Select GitHub image
    window.selectGithubImage = function (imageUrl, imageName) {
        selectedMeme = null;
        githubImageSearch.value = imageName;
        loadBackgroundImage(imageUrl);
        githubDropdown.classList.remove('show');
        updatePreview();
    }

    // Load background image
    function loadBackgroundImage(url) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () {
            backgroundImage = img;
            updatePreview();
        };
        img.onerror = function () {
            alert('❌ Resim yüklenemedi: ' + url);
            backgroundImage = null;
            updatePreview();
        };
        img.src = url;
    }

    // Set color from palette
    window.setColor = function (color) {
        colorInput.value = color;
        updatePreview();
    }

    // Set text position
    window.setTextPosition = function (position) {
        const activeBox = textBoxes.find(box => box.id === activeTextBoxId);
        if (!activeBox) return;

        switch (position) {
            case 'top':
                activeBox.y = 100;
                break;
            case 'center':
                activeBox.y = 200;
                break;
            case 'bottom':
                activeBox.y = 300;
                break;
        }

        textY.value = activeBox.y;
        textYValue.textContent = activeBox.y + 'px';
        renderTextBoxes();
        updatePreview();
    }

    // Update position values
    function updatePositionValues() {
        textXValue.textContent = textX.value + 'px';
        textYValue.textContent = textY.value + 'px';
    }

    // Update effect values
    function updateEffectValues() {
        shadowBlurValue.textContent = shadowBlur.value + 'px';
        shadowOffsetValue.textContent = shadowOffset.value + 'px';
    }

    // Update preview
    function updatePreview() {
        updateActiveBoxFromControls();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Arka plan çiz
        if (backgroundImage) {
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        } else {
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Tüm görünür metin kutularını çiz
        textBoxes.forEach(box => {
            if (!box.visible || !box.text.trim()) return;

            // Meme stili metin (beyaz metin + siyah kontur)
            if (box.font === 'Impact' || box.font === 'Arial Black') {
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = Math.max(2, box.fontSize / 15);
                ctx.font = `${box.weight} ${box.fontSize}px ${box.font}`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                const lines = box.text.split('\n');
                const lineHeight = box.fontSize * 1.1;
                const startY = box.y - ((lines.length - 1) * lineHeight) / 2;

                lines.forEach((line, index) => {
                    const y = startY + (index * lineHeight);
                    ctx.strokeText(line, box.x, y);
                });

                ctx.fillStyle = box.color;
                lines.forEach((line, index) => {
                    const y = startY + (index * lineHeight);
                    ctx.fillText(line, box.x, y);
                });
            } else {
                ctx.font = `${box.weight} ${box.fontSize}px ${box.font}`;
                ctx.fillStyle = box.color;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.shadowColor = box.shadowColor;
                ctx.shadowBlur = box.shadowBlur;
                ctx.shadowOffsetX = box.shadowOffset;
                ctx.shadowOffsetY = box.shadowOffset;

                const lines = box.text.split('\n');
                const lineHeight = box.fontSize * 1.2;
                const startY = box.y - ((lines.length - 1) * lineHeight) / 2;

                lines.forEach((line, index) => {
                    ctx.fillText(line, box.x, startY + (index * lineHeight));
                });
            }

            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        });

        updateLiveUrls();
    }

    // Generate and update URLs dynamically
    function updateLiveUrls() {
        updateActiveBoxFromControls();

        const baseUrl = window.location.origin + window.location.pathname.replace('create-static-image.html', '');

        const firstBox = textBoxes.find(box => box.visible && box.text.trim());
        let mainParams = '';
        if (firstBox) {
            mainParams = `text=${encodeURIComponent(firstBox.text)}&size=${firstBox.fontSize}&color=${encodeURIComponent(firstBox.color)}&font=${encodeURIComponent(firstBox.font)}&weight=${firstBox.weight}&x=${firstBox.x}&y=${firstBox.y}&shadowBlur=${firstBox.shadowBlur}&shadowOffset=${firstBox.shadowOffset}&shadowColor=${encodeURIComponent(firstBox.shadowColor)}`;
        }

        let textParams = '';
        let visibleBoxIndex = 0;
        textBoxes.forEach((box) => {
            if (box.visible && box.text.trim()) {
                const prefix = `&t${visibleBoxIndex}`;
                textParams += `${prefix}_text=${encodeURIComponent(box.text)}`;
                textParams += `${prefix}_x=${box.x}`;
                textParams += `${prefix}_y=${box.y}`;
                textParams += `${prefix}_size=${box.fontSize}`;
                textParams += `${prefix}_color=${encodeURIComponent(box.color)}`;
                textParams += `${prefix}_font=${encodeURIComponent(box.font)}`;
                textParams += `${prefix}_weight=${box.weight}`;
                textParams += `${prefix}_shadowBlur=${box.shadowBlur}`;
                textParams += `${prefix}_shadowOffset=${box.shadowOffset}`;
                textParams += `${prefix}_shadowColor=${encodeURIComponent(box.shadowColor)}`;
                visibleBoxIndex++;
            }
        });

        let templateParam = '';
        if (selectedMeme) {
            templateParam = `&template=${selectedMeme.id}`;
        } else if (customImageUrl.value.trim()) {
            templateParam = `&bg=${encodeURIComponent(customImageUrl.value.trim())}`;
        }

        const pngUrl = `${baseUrl}resim.png?${mainParams}${textParams}${templateParam}`;
        document.getElementById('pngUrl').textContent = pngUrl;
        currentUrl = pngUrl;

        return pngUrl;
    }

    // Download image as PNG
    window.downloadImage = function () {
        updatePreview();
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'meme.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showNotification('✅ Görsel başarıyla indirildi!', 'success');
        }, 'image/png', 1.0);
    }

    // Copy URL to clipboard
    window.copyUrlToClipboard = async function () {
        try {
            const pngUrl = document.getElementById('pngUrl').textContent;
            if (pngUrl && pngUrl !== 'URL oluşturuluyor...') {
                await navigator.clipboard.writeText(pngUrl);

                // Buton animasyonu
                const button = event.target;
                const originalText = button.innerHTML;
                button.innerHTML = '✅ Kopyalandı!';
                button.style.background = '#28a745';

                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = '';
                }, 2000);

                // Toast bildirimi
                showNotification('✅ URL başarıyla kopyalandı!', 'success');
            } else {
                showNotification('⚠️ Henüz kopyalanacak URL yok!', 'warning');
            }
        } catch (err) {
            console.error('URL kopyalama hatası:', err);
            showNotification('❌ URL kopyalanamadı! Tarayıcınız desteklemiyor olabilir.', 'error');
        }
    }

    // Show notification
    function showNotification(message, type = 'info') {
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;

        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8',
            warning: '#ffc107'
        };

        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: -400px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 15px;
            z-index: 10000;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 280px;
            transition: right 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;

        notification.innerHTML = `
            <span style="font-size: 20px;">${icons[type] || icons.info}</span>
            <span>${message}</span>
        `;

        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { 
                        right: -400px;
                        opacity: 0;
                    }
                    to { 
                        right: 20px;
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from { 
                        right: 20px;
                        opacity: 1;
                    }
                    to { 
                        right: -400px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Slide in
        setTimeout(() => {
            notification.style.right = '20px';
        }, 10);

        // Slide out
        setTimeout(() => {
            notification.style.right = '-400px';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }

    // Event listeners
    function setupEventListeners() {
        fontSizeInput.addEventListener('input', () => {
            fontSizeValue.textContent = fontSizeInput.value + 'px';
            updatePreview();
            renderTextBoxes();
        });

        colorInput.addEventListener('input', () => {
            updatePreview();
            renderTextBoxes();
        });

        fontFamily.addEventListener('change', () => {
            updatePreview();
            renderTextBoxes();
        });

        fontWeight.addEventListener('change', () => {
            updatePreview();
            renderTextBoxes();
        });

        textX.addEventListener('input', () => {
            updatePositionValues();
            updatePreview();
            renderTextBoxes();
        });

        textY.addEventListener('input', () => {
            updatePositionValues();
            updatePreview();
            renderTextBoxes();
        });

        shadowBlur.addEventListener('input', () => {
            updateEffectValues();
            updatePreview();
        });

        shadowOffset.addEventListener('input', () => {
            updateEffectValues();
            updatePreview();
        });

        shadowColor.addEventListener('input', updatePreview);

        customImageUrl.addEventListener('input', () => {
            const url = customImageUrl.value.trim();
            if (url) {
                loadBackgroundImage(url);
                memeSearch.value = 'Özel Resim';
            } else {
                backgroundImage = null;
                updatePreview();
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.meme-selector')) {
                memeDropdown.classList.remove('show');
            }
            if (!e.target.closest('#githubImageSearch') && !e.target.closest('#githubDropdown')) {
                githubDropdown.classList.remove('show');
            }
        });
    }

    // Initialize advanced meme creator
    init();
    setupEventListeners();
}

// ===========================================
// OTOMATIK BAŞLATMA
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    // Hangi sayfada olduğumuzu kontrol et
    if (document.getElementById('canvas')) {
        if (document.getElementById('textBoxes')) {
            // Gelişmiş meme oluşturucu sayfası
            initAdvancedMeme();
        } else {
            // Basit meme oluşturucu sayfası
            initSimpleMeme();
        }
    }
});