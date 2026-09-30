import React, { useState } from 'react';
import { Brain, BookOpen, Plus, X, Search, Edit, Trash2, ChevronDown, ChevronUp, Stethoscope, Pill, Dna, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const KNOWLEDGE_CATEGORIES = [
  { id: 'cardiology', name: 'Cardiology', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
  { id: 'pharmacology', name: 'Pharmacology', icon: Pill, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'genomics', name: 'Genomics', icon: Dna, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'clinical_guidelines', name: 'Clinical Guidelines', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' }
];

export default function DoctorKnowledgeBase({ isOpen, onClose }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  
  const [knowledgeItems, setKnowledgeItems] = useState([
    {
      id: 1,
      category: 'cardiology',
      title: 'Atrial Fibrillation Management',
      content: 'For AFib patients with CHA2DS2-VASc score ≥2, anticoagulation is recommended. First-line agents include DOACs (apixaban, rivaroxaban) over warfarin unless contraindicated. Rate control with beta-blockers or calcium channel blockers for HR >110 bpm.',
      doctor: 'Dr. Sarah Chen',
      date: '2024-01-15',
      evidenceLevel: 'Level A'
    },
    {
      id: 2,
      category: 'pharmacology',
      title: 'CYP2C19 Drug Interactions',
      content: 'CYP2C19 poor metabolizers (*2/*2, *2/*3, *3/*3) have reduced activation of clopidogrel. Consider alternative antiplatelet therapy (ticagrelor, prasugrel) for patients requiring dual antiplatelet therapy after PCI.',
      doctor: 'Dr. Michael Roberts',
      date: '2024-01-10',
      evidenceLevel: 'Level A'
    },
    {
      id: 3,
      category: 'genomics',
      title: 'TPMT Thiopurine Dosing',
      content: 'TPMT deficiency increases risk of myelosuppression with azathioprine/6-MP. Dose reduce to 10% of standard for homozygous deficient patients, 30-50% for heterozygous. Monitor CBC weekly for first month.',
      doctor: 'Dr. Emily Watson',
      date: '2024-01-08',
      evidenceLevel: 'Level A'
    },
    {
      id: 4,
      category: 'clinical_guidelines',
      title: 'ACC/AHA Hypertension Guidelines',
      content: 'Stage 1 hypertension (130-139/80-89 mmHg): lifestyle modification first. Stage 2 (≥140/90 mmHg): initiate medication with two first-line agents from different classes. Target <130/80 mmHg for most patients.',
      doctor: 'Dr. James Miller',
      date: '2024-01-05',
      evidenceLevel: 'Level A'
    }
  ]);

  const [newKnowledge, setNewKnowledge] = useState({
    category: 'cardiology',
    title: '',
    content: '',
    evidenceLevel: 'Level B'
  });

  if (!isOpen) return null;

  const filteredItems = knowledgeItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddKnowledge = (e) => {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      ...newKnowledge,
      doctor: 'Dr. Current User',
      date: new Date().toISOString().split('T')[0]
    };
    setKnowledgeItems(prev => [...prev, newItem]);
    setIsAddModalOpen(false);
    setNewKnowledge({ category: 'cardiology', title: '', content: '', evidenceLevel: 'Level B' });
  };

  const handleDeleteKnowledge = (id) => {
    setKnowledgeItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getCategoryIcon = (categoryId) => {
    const category = KNOWLEDGE_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.icon : BookOpen;
  };

  const getCategoryColor = (categoryId) => {
    const category = KNOWLEDGE_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? { color: category.color, bg: category.bg } : { color: 'text-slate-600', bg: 'bg-slate-50' };
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl border border-slate-300 w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-sans-medical"
      >
        {/* Modal Header */}
        <div className="bg-[#0B192C] text-white p-4 px-6 flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-medical text-lg font-bold text-white">
                Doctor Knowledge Base
              </h3>
              <p className="text-xs text-slate-300">
                MoveOn AI Solutions · Clinical Expertise Repository
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Categories */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full mb-4 px-4 py-2 bg-[#0B192C] text-amber-300 font-bold rounded-lg hover:bg-[#1E3E62] transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Knowledge
            </button>

            <div className="space-y-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`w-full px-4 py-2 rounded-lg text-left text-sm font-medium transition-all ${
                  activeCategory === 'all' 
                    ? 'bg-[#0B192C] text-amber-300' 
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Categories
              </button>
              {KNOWLEDGE_CATEGORIES.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full px-4 py-2 rounded-lg text-left text-sm font-medium transition-all flex items-center gap-2 ${
                      activeCategory === category.id 
                        ? 'bg-[#0B192C] text-amber-300' 
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${activeCategory === category.id ? 'text-amber-300' : category.color}`} />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search Bar */}
            <div className="p-4 border-b border-slate-200">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search knowledge base..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Knowledge Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="font-medium">No knowledge items found</p>
                  <p className="text-sm">Add your clinical expertise to help the AI provide better recommendations</p>
                </div>
              ) : (
                filteredItems.map(item => {
                  const Icon = getCategoryIcon(item.category);
                  const colors = getCategoryColor(item.category);
                  const isExpanded = expandedItems[item.id];

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all"
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`p-2 rounded-lg ${colors.bg} ${colors.color} mt-1`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-slate-900">{item.title}</h4>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                                  {item.evidenceLevel}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mb-2">
                                By {item.doctor} · {item.date}
                              </p>
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-sm text-slate-700 leading-relaxed mb-3"
                                  >
                                    {item.content}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              {!isExpanded && (
                                <p className="text-sm text-slate-600 line-clamp-2">
                                  {item.content}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleExpand(item.id)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-all"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDeleteKnowledge(item.id)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Add Knowledge Modal */}
        <AnimatePresence>
          {isAddModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-10"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl border border-slate-300 w-full max-w-lg shadow-2xl overflow-hidden"
              >
                <div className="bg-[#0B192C] text-white p-4 px-6 flex items-center justify-between">
                  <h3 className="font-serif-medical text-lg font-bold">Add Clinical Knowledge</h3>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddKnowledge} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select
                      value={newKnowledge.category}
                      onChange={(e) => setNewKnowledge(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    >
                      {KNOWLEDGE_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newKnowledge.title}
                      onChange={(e) => setNewKnowledge(prev => ({ ...prev, title: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      placeholder="e.g., Hypertension Management Guidelines"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Clinical Knowledge</label>
                    <textarea
                      value={newKnowledge.content}
                      onChange={(e) => setNewKnowledge(prev => ({ ...prev, content: e.target.value }))}
                      required
                      rows="4"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      placeholder="Share your clinical expertise, guidelines, or best practices..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Evidence Level</label>
                    <select
                      value={newKnowledge.evidenceLevel}
                      onChange={(e) => setNewKnowledge(prev => ({ ...prev, evidenceLevel: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="Level A">Level A (High-quality evidence)</option>
                      <option value="Level B">Level B (Moderate-quality evidence)</option>
                      <option value="Level C">Level C (Low-quality evidence)</option>
                      <option value="Expert Opinion">Expert Opinion</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0B192C] text-amber-300 font-bold rounded-lg hover:bg-[#1E3E62] transition-all"
                    >
                      Add Knowledge
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}