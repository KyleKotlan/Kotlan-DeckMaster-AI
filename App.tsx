import React, { useState } from 'react';
import { DeckDimensions, MaterialCategory } from './types';
import { DEFAULT_DIMENSIONS } from './constants';
import { generateMaterialList } from './services/geminiService';
import InputForm from './components/InputForm';
import MaterialList from './components/MaterialList';
import Visualizer from './components/Visualizer';
import { LayoutDashboard, Github } from 'lucide-react';

const App: React.FC = () => {
  const [dimensions, setDimensions] = useState<DeckDimensions>(DEFAULT_DIMENSIONS);
  const [materials, setMaterials] = useState<MaterialCategory[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateMaterialList(dimensions);
      setMaterials(result);
    } catch (err) {
      console.error(err);
      setError("Failed to generate material list. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">DeckMaster <span className="text-blue-600">AI</span></h1>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider leading-none">Smart Project Planner</p>
              </div>
            </div>
            <div className="flex items-center">
              <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input & Visualization */}
          <div className="lg:col-span-5 space-y-6">
            <InputForm 
              dimensions={dimensions} 
              onChange={setDimensions} 
              onSubmit={handleGenerate}
              isLoading={isLoading}
            />
            
            <div className="hidden lg:block">
              <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Top-Down Preview</h3>
              <Visualizer dimensions={dimensions} />
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200 flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
              </div>
            )}
            
            <MaterialList materials={materials} />
          </div>

          {/* Mobile Visualizer Order Adjustment */}
          <div className="lg:hidden col-span-1">
             <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Preview</h3>
            <Visualizer dimensions={dimensions} />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} DeckMaster AI. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
