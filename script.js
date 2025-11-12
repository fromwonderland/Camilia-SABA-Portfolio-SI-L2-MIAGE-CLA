// État de l'application
let currentFileIndex = -1;
let files = [];
let currentChapter = null;
let isHomeViewActive = true; // La vue d'accueil est active par défaut

// Éléments du DOM
const chaptersDropdown = document.querySelector('.dropdown-content');
const filesDropdown = document.getElementById('files-dropdown');
const fileContent = document.getElementById('file-content');

// Données des chapitres et fichiers
const appData = {
    '📂Notes de cours': ['SI_Notes_de_Cours_Personnelles.pdf'],
    '📂Dossier 1: INTRODUCTION AUX SYSTEMES D INFORMATION': ['DOSSIER1_td_PGI_exercice.pdf'],
    '📂Dossier 2: ACTEURS ET FLUX': ['DOSSIER2_TP_Odoo.pdf'],
    '📂Dossier 3: LIVRABLES': ['DOSSIER3 Training schéma réponse.pdf', 'DOSSIER3_ProcessusGestion_Activites_Acteurs.pdf', 'DOSSIER3_Les livrables_1.pdf','DOSSIER3_Les livrables_2.pdf'],
    '📂Dossier 4: DIAGRAMME DE GANTT': ['DOSSIER4_Diagramme_Gantt.pdf'],
    '📂Dossier 5: USE CASE': [],
    '📂Dossier 6: GESTION D UN PROJET SI': ['Dossier6 Cours Gestion de projets SI.pdf', 'Dossier6_SFG_TalentSeek.pdf'],
    '📂Certifications': ['Camilia_SABA_Certification_PIX.pdf', 'Sololearn Certification Introduction to Java.pdf'],
    '📂Projet final': ['Projet_final.pdf'],
    '📂Soutenance (diaporama)': ['Soutenance_Diaporama_AURA_SI.pptx'],
    '📂Autres documents': ['Autres_documents.pdf']
};

// Gestion du mode plein écran
function setupFullscreen() {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const fullscreenIcon = fullscreenBtn.querySelector('.fullscreen-icon');
    
    // Ajouter l'icône de réduction (sera affichée en mode plein écran)
    const minimizeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    minimizeIcon.setAttribute('class', 'minimize-icon');
    minimizeIcon.setAttribute('viewBox', '0 0 24 24');
    minimizeIcon.setAttribute('fill', 'none');
    minimizeIcon.setAttribute('stroke', 'currentColor');
    minimizeIcon.setAttribute('stroke-width', '2');
    minimizeIcon.setAttribute('stroke-linecap', 'round');
    minimizeIcon.setAttribute('stroke-linejoin', 'round');
    
    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path1.setAttribute('d', 'M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3');
    
    minimizeIcon.appendChild(path1);
    fullscreenBtn.appendChild(minimizeIcon);
    
    // Basculer le mode plein écran
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Erreur lors de l'activation du mode plein écran: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });
    
    // Mettre à jour l'icône lors des changements de mode plein écran
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            fullscreenIcon.style.display = 'none';
            minimizeIcon.style.display = 'block';
        } else {
            fullscreenIcon.style.display = 'block';
            minimizeIcon.style.display = 'none';
        }
    });
}

// Gestion de la modale du guide
function setupGuideModal() {
    const modal = document.getElementById('guide-modal');
    const btn = document.getElementById('guide-btn');
    const span = document.getElementsByClassName('close-guide')[0];
    
    // Ouvrir la modale quand on clique sur le bouton
    btn.onclick = function() {
        modal.style.display = 'flex';
    }
    
    // Fermer quand on clique sur la croix
    span.onclick = function() {
        modal.style.display = 'none';
    }
    
    // Fermer quand on clique en dehors de la modale
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

// Afficher la vue d'accueil
function showHomeView() {
    const homeView = document.getElementById('home-view');
    const mainContent = document.getElementById('main-content');
    const mobileHomeBtn = document.getElementById('home-btn');
    const desktopHomeBtn = document.getElementById('home-btn-desktop');
    
    homeView.classList.add('active');
    mainContent.classList.add('hidden');
    
    // Mettre à jour les deux boutons d'accueil
    if (mobileHomeBtn) mobileHomeBtn.classList.add('active');
    if (desktopHomeBtn) desktopHomeBtn.classList.add('active');
    
    isHomeViewActive = true;
    
    // Remplir la vue d'accueil avec les chapitres et fichiers
    const chaptersContainer = document.getElementById('chapters-container');
    chaptersContainer.innerHTML = '';
    
    let chapterNumber = 1;
    Object.entries(appData).forEach(([chapter, chapterFiles]) => {
        if (chapterFiles.length === 0) return;
        
        const chapterSection = document.createElement('div');
        chapterSection.className = 'chapter-section';
        
        const chapterTitle = document.createElement('h2');
        chapterTitle.className = 'chapter-title';
        chapterTitle.innerHTML = `<span class="chapter-number">${chapterNumber}.</span> ${chapter}`;
        
        const filesList = document.createElement('div');
        filesList.className = 'files-list';
        
        chapterFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            // Créer un nom de fichier plus lisible pour l'affichage
            const displayName = file.replace(/\.(pdf|docx?|xlsx?|pptx?)$/i, '')
                                 .replace(/_/g, ' ')
                                 .replace(/\b\w/g, l => l.toUpperCase());
            
            fileItem.innerHTML = `
                <span class="file-icon">📜</span>
                <span class="file-name">${chapterNumber}.${index + 1} - ${displayName}</span>
            `;
            
            fileItem.addEventListener('click', () => {
                loadChapter(chapter);
                openFile(index);
                showFileView();
            });
            
            filesList.appendChild(fileItem);
        });
        
        chapterSection.appendChild(chapterTitle);
        chapterSection.appendChild(filesList);
        chaptersContainer.appendChild(chapterSection);
        chapterNumber++;
    });
}

// Afficher la vue de fichier
function showFileView() {
    const homeView = document.getElementById('home-view');
    const mainContent = document.getElementById('main-content');
    const homeBtn = document.getElementById('home-btn');
    
    homeView.classList.remove('active');
    mainContent.classList.remove('hidden');
    homeBtn.classList.remove('active');
    isHomeViewActive = false;
    
    // Si aucun fichier n'est chargé, on charge le premier chapitre
    if (files.length === 0 && currentChapter) {
        loadChapter(currentChapter);
    }
}

// Initialisation de l'application
function initApp() {
    // Initialiser la modale du guide
    setupGuideModal();
    // Initialiser le mode plein écran
    setupFullscreen();
    
    // Initialiser le bouton d'accueil
    document.getElementById('home-btn').addEventListener('click', () => {
        if (isHomeViewActive) {
            showFileView();
        } else {
            showHomeView();
        }
    });
    
    // Charger automatiquement la vue d'accueil
    showHomeView();
    
    // Remplir le menu des chapitres
    const chaptersDropdown = document.querySelector('.dropdown-content');
    Object.keys(appData).forEach(chapter => {
        const chapterElement = document.createElement('a');
        chapterElement.href = '#';
        chapterElement.textContent = chapter;
        chapterElement.addEventListener('click', (e) => {
            e.preventDefault();
            loadChapter(chapter);
        });
        chaptersDropdown.appendChild(chapterElement);
    });

    // Gestion des boutons de navigation
    document.getElementById('prev-file').addEventListener('click', navigateToPreviousFile);
    document.getElementById('next-file').addEventListener('click', navigateToNextFile);
}

// Charger les fichiers d'un chapitre
function loadChapter(chapterName) {
    currentChapter = chapterName;
    files = appData[chapterName] || [];
    
    // Mettre à jour le menu déroulant des fichiers
    filesDropdown.innerHTML = '';
    
    if (files.length > 0) {
        files.forEach((file, index) => {
            const fileElement = document.createElement('a');
            fileElement.href = '#';
            fileElement.textContent = file;
            fileElement.addEventListener('click', (e) => {
                e.preventDefault();
                openFile(index);
                showFileView(); // S'assurer qu'on passe en mode fichier
            });
            filesDropdown.appendChild(fileElement);
        });
    } else {
        const noFilesElement = document.createElement('a');
        noFilesElement.href = '#';
        noFilesElement.textContent = 'Aucun fichier disponible';
        noFilesElement.style.pointerEvents = 'none';
        filesDropdown.appendChild(noFilesElement);
    }
    
    // Afficher le premier fichier du chapitre si disponible
    if (files.length > 0) {
        openFile(0);
        showFileView(); // S'assurer qu'on passe en mode fichier
    } else {
        showNoFilesMessage();
    }
}
function openFile(index) {
    // Mettre à jour l'index du fichier courant
    currentFileIndex = index;
    if (index >= 0 && index < files.length) {
        currentFileIndex = index;
        const fileName = files[index];
        
        // Vérifier si c'est un fichier PDF
        if (fileName.toLowerCase().endsWith('.pdf')) {
            // Afficher le PDF dans un iframe
            // Trouver le numéro du chapitre et formater le nom
            let chapterNumber = 0;
            let fileNumber = index + 1;
            let chapterDisplayName = currentChapter;
            
            // Parcourir les chapitres pour trouver le numéro du chapitre actuel
            for (const [chapter, chapterFiles] of Object.entries(appData)) {
                if (chapterFiles.length > 0) {
                    chapterNumber++;
                    if (chapter === currentChapter) {
                        chapterDisplayName = chapter.replace(/_/g, ' ')
                                                .replace(/\b\w/g, l => l.toUpperCase());
                        break;
                    }
                }
            }
            
            // Créer le nom de fichier affiché
            const displayName = fileName.replace(/\.(pdf|docx?|xlsx?|pptx?)$/i, '')
                                     .replace(/_/g, ' ')
                                     .replace(/\b\w/g, l => l.toUpperCase());
            
            fileContent.innerHTML = `
                <div class="file-container">
                    <div class="file-header">
                        <div class="file-path">
                            <span class="chapter-path">${chapterNumber}. ${chapterDisplayName}</span>
                            <span class="path-separator"> → </span>
                            <span class="file-path-name">${chapterNumber}.${fileNumber} ${displayName}</span>
                        </div>
                    </div>
                    <div class="file-preview">
                        <iframe 
                            src="${fileName}" 
                            width="100%" 
                            height="600px"
                            style="border: 1px solid #444; border-radius: 4px;"
                        >
                            Votre navigateur ne supporte pas les PDF. 
                            <a href="${fileName}">Télécharger le fichier</a>
                        </iframe>
                        <p class="file-info">
                            <span>Fichier ${fileNumber} sur ${files.length}</span>
                        </p>
                    </div>
                </div>
            `;
        } else {
            // Pour les autres types de fichiers (exemple)
            // Même logique de numérotation pour les fichiers non-PDF
            let chapterNumber = 0;
            let fileNumber = index + 1;
            let chapterDisplayName = currentChapter;
            
            for (const [chapter, chapterFiles] of Object.entries(appData)) {
                if (chapterFiles.length > 0) {
                    chapterNumber++;
                    if (chapter === currentChapter) {
                        chapterDisplayName = chapter.replace(/_/g, ' ')
                                                .replace(/\b\w/g, l => l.toUpperCase());
                        break;
                    }
                }
            }
            
            const displayName = fileName.replace(/\.(pdf|docx?|xlsx?|pptx?)$/i, '')
                                     .replace(/_/g, ' ')
                                     .replace(/\b\w/g, l => l.toUpperCase());
            
            fileContent.innerHTML = `
                <div class="file-container">
                    <div class="file-header">
                        <div class="file-path">
                            <span class="chapter-path">${chapterNumber}. ${chapterDisplayName}</span>
                            <span class="path-separator"> → </span>
                            <span class="file-path-name">${chapterNumber}.${fileNumber} ${displayName}</span>
                        </div>
                    </div>
                    <div class="file-preview">
                        <p>Contenu du fichier : ${displayName}</p>
                        <p>Fichier ${fileNumber} sur ${files.length}</p>
                    </div>
                </div>`;
        }
    }
}

// Navigation entre les fichiers et les chapitres
function navigateToPreviousFile() {
    if (files.length === 0) return;
    
    // Si on est au premier fichier du chapitre actuel
    if (currentFileIndex <= 0) {
        // Récupérer tous les noms de chapitres
        const chapterNames = Object.keys(appData);
        const currentChapterIndex = chapterNames.indexOf(currentChapter);
        
        // Aller au dernier fichier du chapitre précédent
        if (currentChapterIndex > 0) {
            const prevChapter = chapterNames[currentChapterIndex - 1];
            const prevChapterFiles = appData[prevChapter];
            
            if (prevChapterFiles && prevChapterFiles.length > 0) {
                loadChapter(prevChapter);
                openFile(prevChapterFiles.length - 1); // Dernier fichier du chapitre précédent
            } else {
                // Si le chapitre précédent n'a pas de fichiers, on essaie avec le chapitre d'avant
                currentChapter = prevChapter;
                navigateToPreviousFile();
            }
        } else {
            // Si on est au premier chapitre, on reste sur le premier fichier
            openFile(0);
        }
    } else {
        // Aller au fichier précédent dans le chapitre actuel
        openFile(currentFileIndex - 1);
    }
}

function navigateToNextFile() {
    if (files.length === 0) return;
    
    // Si on est au dernier fichier du chapitre actuel
    if (currentFileIndex >= files.length - 1) {
        // Récupérer tous les noms de chapitres
        const chapterNames = Object.keys(appData);
        const currentChapterIndex = chapterNames.indexOf(currentChapter);
        
        // Aller au premier fichier du chapitre suivant
        if (currentChapterIndex < chapterNames.length - 1) {
            const nextChapter = chapterNames[currentChapterIndex + 1];
            const nextChapterFiles = appData[nextChapter];
            
            if (nextChapterFiles && nextChapterFiles.length > 0) {
                loadChapter(nextChapter);
                openFile(0); // Premier fichier du chapitre suivant
            } else {
                // Si le chapitre suivant n'a pas de fichiers, on essaie avec le prochain
                currentChapter = nextChapter;
                navigateToNextFile();
            }
        } else {
            // Si on est au dernier chapitre, on reste sur le dernier fichier
            openFile(files.length - 1);
        }
    } else {
        // Aller au fichier suivant dans le chapitre actuel
        openFile(currentFileIndex + 1);
    }
}

// Afficher un message quand aucun fichier n'est disponible
function showNoFilesMessage() {
    fileContent.innerHTML = `
        <div class="welcome-message">
            <h1>Aucun fichier disponible</h1>
            <p>Le chapitre sélectionné ne contient aucun fichier.</p>
        </div>
    `;
}

// Gestion du clic sur le bouton Accueil (mobile et desktop)
function setupHomeButtons() {
    const homeButtons = document.querySelectorAll('.home-btn');
    homeButtons.forEach(button => {
        button.addEventListener('click', () => {
            showHomeView();
        });
    });
}

// Désactiver le clic sur le logo et le texte
function setupLogoClickHandler() {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        
        // Désactiver également le clic sur l'image et le texte individuellement
        const logoImg = document.querySelector('.logo-img');
        const logoSpan = document.querySelector('.logo span');
        
        [logoImg, logoSpan].forEach(element => {
            if (element) {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            }
        });
    }
}

// Initialiser l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupHomeButtons();
    setupFullscreen();
    setupGuideModal();
    setupLogoClickHandler();
    
    // Ajouter un écouteur d'événement pour le clic sur les fichiers dans la vue d'accueil
    document.addEventListener('click', (e) => {
        const fileItem = e.target.closest('.file-item');
        if (fileItem) {
            const chapter = fileItem.dataset.chapter;
            const fileIndex = parseInt(fileItem.dataset.index);
            if (chapter && !isNaN(fileIndex)) {
                loadChapter(chapter);
                openFile(fileIndex);
                showFileView();
            }
        }
    });
});
