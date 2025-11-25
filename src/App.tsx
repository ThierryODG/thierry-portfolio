import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Mail, Phone, Linkedin, Facebook, X, Image as ImageIcon, ChevronLeft, ChevronRight, Palette, Pen, Layers, Sparkles } from 'lucide-react';
import { SiWhatsapp, SiTiktok } from 'react-icons/si';

interface ProjectImage {
  filename: string;
  path: string;
  category: string;
  size: number;
}

interface Project {
  name: string;
  type: string;
  images: ProjectImage[];
  subfolders: Project[];
  logo: string | null;
}

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [lightboxImages, setLightboxImages] = useState<Array<ProjectImage & { projectName: string }>>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filter, setFilter] = useState<string>('all');
  const [rotatingWord, setRotatingWord] = useState(0);

  const creativeWords = [
    'Créatif',
    'Innovant',
    'Professionnel',
    'Moderne',
    'Dynamique',
    'Unique',
    'Élégant',
    'Inspirant',
    'Authentique',
    'Visionnaire',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingWord((prev) => (prev + 1) % creativeWords.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch('/projects.json')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error('Error loading projects:', err));
  }, []);

  // Get all images from all projects (flattened)
  const getAllImages = () => {
    const images: Array<ProjectImage & { projectName: string }> = [];
    projects.forEach(project => {
      project.images.forEach(img => images.push({ ...img, projectName: project.name }));
      project.subfolders.forEach(subfolder => {
        subfolder.images.forEach(img => images.push({ ...img, projectName: `${project.name} - ${subfolder.name}` }));
      });
    });
    return images;
  };

  const allImages = getAllImages();
  const categories = ['all', ...new Set(allImages.map(img => img.category))];

  const filteredImages = filter === 'all'
    ? allImages
    : allImages.filter(img => img.category === filter);

  const openLightbox = (images: Array<ProjectImage & { projectName: string }>, startIndex: number) => {
    setLightboxImages(images);
    setCurrentImageIndex(startIndex);
  };

  const closeLightbox = () => {
    setLightboxImages([]);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  // Decorative floating icons
  const floatingIcons = [
    { Icon: Palette, delay: 0, x: '10%', y: '20%' },
    { Icon: Pen, delay: 0.5, x: '85%', y: '15%' },
    { Icon: Layers, delay: 1, x: '15%', y: '70%' },
    { Icon: Sparkles, delay: 1.5, x: '90%', y: '65%' },
  ];

  // Get random images for mosaic background
  const mosaicImages = allImages.slice(0, 20);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-primary-dark text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* 3D Mosaic Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" style={{
            perspective: '1000px',
            transform: 'rotateX(10deg)',
            transformStyle: 'preserve-3d'
          }}>
            <div className="grid grid-cols-5 gap-4 p-8 opacity-20" style={{
              transform: 'rotateX(-15deg) rotateY(5deg) translateZ(-100px)',
              transformStyle: 'preserve-3d'
            }}>
              {mosaicImages.map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-square rounded-lg overflow-hidden shadow-2xl"
                  style={{
                    transform: `translateZ(${(idx % 3) * 20}px) rotateZ(${(idx % 2 === 0 ? 3 : -3)}deg)`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <img
                    src={`/02-CONCEPTION${img.path}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Gradient Overlay - stronger at bottom, fades at top */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/95 to-primary/60"></div>
        </div>

        {/* Floating decorative icons */}
        {floatingIcons.map(({ Icon, delay, x, y }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.3, 0.3, 0],
              scale: [0, 1, 1, 0],
              y: [0, -20, 0, -20, 0]
            }}
            transition={{
              duration: 8,
              delay: delay,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeInOut"
            }}
            className="absolute pointer-events-none z-10"
            style={{ left: x, top: y }}
          >
            <Icon className="w-12 h-12 text-accent/40" strokeWidth={1.5} />
          </motion.div>
        ))}

        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-block"
          >
            <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-accent via-accent-hover to-accent p-1 shadow-2xl shadow-accent/50">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-primary-dark">
                <img
                  src="/photo Thierry.jpg"
                  alt="Thierry OUEDRAOGO"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            Thierry <span className="text-accent">OUEDRAOGO</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto"
          >
            Designer Graphique | Infographe Professionnel
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center items-center"
          >
            <a
              href="/CV-Thierry.pdf"
              download="CV-Thierry-OUEDRAOGO.pdf"
              className="px-8 py-4 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-all shadow-lg shadow-accent/30 hover:shadow-accent/50 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Télécharger CV
            </a>

            <div className="flex gap-3">
              <a
                href="mailto:tcrouedraogo@gmail.com"
                className="p-3 bg-primary-light/80 hover:bg-primary rounded-lg transition-colors backdrop-blur-sm border border-primary-light/30"
                title="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="tel:+22655270101"
                className="p-3 bg-primary-light/80 hover:bg-primary rounded-lg transition-colors backdrop-blur-sm border border-primary-light/30"
                title="Appeler"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/22655270101?text=Bonjour%20Thierry%2C%20j'ai%20découvert%20votre%20portfolio%20et%20je%20suis%20intéressé%20par%20vos%20services%20de%20design%20graphique."
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-primary-light/80 hover:bg-primary rounded-lg transition-colors backdrop-blur-sm border border-primary-light/30"
                title="WhatsApp"
              >
                <SiWhatsapp className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61557294006440"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-primary-light/80 hover:bg-primary rounded-lg transition-colors backdrop-blur-sm border border-primary-light/30"
                title="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/thierry-ouedraogo-a1614a2a6"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-primary-light/80 hover:bg-primary rounded-lg transition-colors backdrop-blur-sm border border-primary-light/30"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@thierryouedraogo81"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-primary-light/80 hover:bg-primary rounded-lg transition-colors backdrop-blur-sm border border-primary-light/30"
                title="TikTok"
              >
                <SiTiktok className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-12"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary-light/70 rounded-full border-2 border-primary-light/50 backdrop-blur-sm shadow-lg">
              <ImageIcon className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium">{allImages.length} Réalisations</span>
              <span className="text-slate-400">•</span>
              <span className="text-sm font-medium">{projects.length} Projets</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-white/50 rounded-full"></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Portfolio Section */}
      <section className="relative py-20 px-4 bg-background text-primary">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <span>Portfolio</span>
              <span className="inline-block relative h-[1.2em] w-[220px]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={rotatingWord}
                    initial={{ rotateX: 90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    exit={{ rotateX: -90, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute left-0 top-0 text-accent"
                    style={{ transformOrigin: 'center center', transformStyle: 'preserve-3d' }}
                  >
                    {creativeWords[rotatingWord]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h2>
            <p className="text-slate-600 text-lg">
              Découvrez mes réalisations en design graphique
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-3 justify-center mb-12"
          >
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${filter === category
                  ? 'bg-accent text-white shadow-lg shadow-accent/30'
                  : 'bg-white text-primary hover:bg-slate-100 border border-slate-200'
                  }`}
              >
                {category === 'all' ? 'Tous' : category}
              </button>
            ))}
          </motion.div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredImages.slice(0, 24).map((image, index) => (
                <motion.div
                  key={image.path}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                  onClick={() => {
                    const project = projects.find(p =>
                      p.images.some(img => img.path === image.path) ||
                      p.subfolders.some(sf => sf.images.some(img => img.path === image.path))
                    );
                    if (project) setSelectedProject(project);
                  }}
                >
                  <img
                    src={`/02-CONCEPTION${image.path}`}
                    alt={image.filename}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-semibold text-sm line-clamp-1">{image.projectName}</p>
                      <p className="text-slate-300 text-xs">{image.category}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredImages.length > 24 && (
            <div className="text-center mt-12">
              <p className="text-slate-600">
                Et {filteredImages.length - 24} autres réalisations...
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox/Carousel */}
      <AnimatePresence>
        {lightboxImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>

            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`/02-CONCEPTION${lightboxImages[currentImageIndex].path}`}
                alt={lightboxImages[currentImageIndex].filename}
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="mt-4 text-center">
                <p className="text-white font-semibold text-lg">
                  {lightboxImages[currentImageIndex].projectName}
                </p>
                <p className="text-slate-400 text-sm">
                  {lightboxImages[currentImageIndex].category} • {currentImageIndex + 1} / {lightboxImages.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
                <div>
                  <h3 className="text-2xl font-bold text-primary">{selectedProject.name}</h3>
                  <p className="text-slate-600 text-sm">
                    {selectedProject.images.length + selectedProject.subfolders.reduce((sum, sf) => sum + sf.images.length, 0)} réalisations
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-primary" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {selectedProject.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedProject.images.map((image, idx) => (
                      <div
                        key={image.path}
                        className="aspect-square rounded-lg overflow-hidden bg-slate-100 cursor-pointer hover:ring-2 hover:ring-accent transition-all"
                        onClick={() => openLightbox(
                          selectedProject.images.map(img => ({ ...img, projectName: selectedProject.name })),
                          idx
                        )}
                      >
                        <img
                          src={`/02-CONCEPTION${image.path}`}
                          alt={image.filename}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {selectedProject.subfolders.map(subfolder => (
                  <div key={subfolder.name} className="border-t border-slate-200 pt-6">
                    <h4 className="text-lg font-semibold text-primary mb-4">{subfolder.name}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {subfolder.images.map((image, idx) => (
                        <div
                          key={image.path}
                          className="aspect-square rounded-lg overflow-hidden bg-slate-100 cursor-pointer hover:ring-2 hover:ring-accent transition-all"
                          onClick={() => openLightbox(
                            subfolder.images.map(img => ({ ...img, projectName: `${selectedProject.name} - ${subfolder.name}` })),
                            idx
                          )}
                        >
                          <img
                            src={`/02-CONCEPTION${image.path}`}
                            alt={image.filename}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skills & Tools Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary via-primary-light to-primary-dark text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Compétences & <span className="text-accent">Outils</span>
            </h2>
            <p className="text-slate-300 text-lg">
              Maîtrise des outils professionnels de design graphique
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              {
                name: 'Adobe Photoshop',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg'
              },
              {
                name: 'Adobe Illustrator',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg'
              },
              {
                name: 'Figma',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg'
              },
              {
                name: 'Canva',
                logo: 'https://freelogopng.com/images/all_img/1656734719canva-logo-transparent.png'
              },
              {
                name: 'CapCut',
                logo: 'https://logos-world.net/wp-content/uploads/2024/01/CapCut-Symbol.png'
              },
            ].map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-primary-light/50 backdrop-blur-sm border border-primary-light/30 rounded-xl p-6 text-center hover:border-accent/50 transition-all group"
              >
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <img
                    src={skill.logo}
                    alt={skill.name}
                    className="w-full h-full object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all"
                  />
                </div>
                <h3 className="font-semibold text-white text-sm">{skill.name}</h3>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-slate-300 text-lg mb-6">
              Prêt à donner vie à vos projets créatifs ?
            </p>
            <a
              href="https://wa.me/22655270101?text=Bonjour%20Thierry%2C%20j'ai%20découvert%20votre%20portfolio%20et%20je%20suis%20intéressé%20par%20vos%20services%20de%20design%20graphique."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-all shadow-lg shadow-accent/30 hover:shadow-accent/50"
            >
              <SiWhatsapp className="w-5 h-5" />
              Contactez-moi
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-dark text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400">
            © 2025 Thierry OUEDRAOGO. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
