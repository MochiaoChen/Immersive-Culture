import React, { useState, useEffect, useRef } from 'react';
import { generateImmersiveImage } from './services/geminiService';
import { SceneOption, ImageSize } from './types';
import { Loader2, Upload, Image as ImageIcon, Download, RefreshCw, Wand2, ChevronRight } from 'lucide-react';
import { SCENES } from './constants';

const App: React.FC = () => {
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedScene, setSelectedScene] = useState<SceneOption>(SCENES[0]);
  const [imageSize, setImageSize] = useState<ImageSize>(ImageSize.SIZE_1K);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial API Key Check
  useEffect(() => {
    const checkKey = async () => {
      // 1. If running in an environment with the AI Studio helper (e.g. IDX or Preview),
      // rely on it to confirm if the user has selected a key.
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      } else {
        // 2. If running in a standard deployment (e.g. Vercel, Netlify) where the helper isn't injected,
        // check if the API key is present in the environment variables.
        setHasApiKey(!!process.env.API_KEY);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      // Assume success as per instructions
      setHasApiKey(true);
      setError(null);
    } else {
      // If the helper is not available but the user is stuck on this screen,
      // it means process.env.API_KEY was missing during the initial check.
      // We can't open the selector, so we alert the user.
      alert("无法打开 API Key 选择器。如果您已部署此应用，请确保在环境变量中配置了 API_KEY。");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setGeneratedImage(null); // Reset generated image on new upload
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setIsGenerating(true);
    setError(null);
    setLoadingStep('正在解析图像与场景...');
    
    // Clean base64 string
    const base64Data = selectedImage.split(',')[1];

    try {
      setLoadingStep(`正在生成 ${imageSize} 分辨率的画面...`);
      const resultBase64 = await generateImmersiveImage(
        base64Data,
        selectedScene,
        imageSize
      );
      setGeneratedImage(resultBase64);
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("Requested entity was not found")) {
         setHasApiKey(false);
         setError("API Key 验证失败，请重新选择。");
      } else {
         setError("生成失败，请重试。" + (err.message || ""));
      }
    } finally {
      setIsGenerating(false);
      setLoadingStep('');
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setGeneratedImage(null);
    setError(null);
  };

  if (!hasApiKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-rice-paper relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
             style={{backgroundImage: `url('https://picsum.photos/1920/1080')`, backgroundSize: 'cover', filter: 'grayscale(100%)'}}>
        </div>
        
        <div className="z-10 max-w-md w-full bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-stone-200 text-center">
          <div className="mb-6 flex justify-center text-cinnabar">
            <Wand2 size={48} />
          </div>
          <h1 className="text-4xl font-calligraphy mb-2 text-ink-black">穿越中华</h1>
          <p className="text-stone-600 mb-8 font-serif">中华优秀传统文化两创实践项目</p>
          
          <div className="space-y-4">
            <p className="text-sm text-stone-500">
              本项目使用 Gemini 3 Pro 图像生成模型。请先选择您的 API Key 以继续。
            </p>
            <button
              onClick={handleSelectKey}
              className="w-full py-3 px-6 bg-cinnabar hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <span>选择 API Key</span>
              <ChevronRight size={18} />
            </button>
            <div className="mt-4 text-xs text-stone-400">
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-cinnabar">
                查看计费说明
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rice-paper text-ink-black font-serif flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-cinnabar rounded-md flex items-center justify-center text-white font-calligraphy text-xl">
               文
             </div>
             <h1 className="text-2xl font-calligraphy text-ink-black">穿越中华</h1>
          </div>
          <div className="text-xs text-stone-500 hidden sm:block">
            Gemini 3 Pro Image Preview
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* Left Column: Configuration */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Upload Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center text-sm">1</span>
                上传照片
              </h2>
              
              {!selectedImage ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 rounded-xl p-8 flex flex-col items-center justify-center text-stone-500 cursor-pointer hover:border-cinnabar hover:bg-red-50 transition-all aspect-[4/3]"
                >
                  <Upload size={32} className="mb-2" />
                  <span className="text-sm">点击上传人物照片</span>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              ) : (
                <div className="relative group rounded-xl overflow-hidden aspect-[4/3] border border-stone-200 bg-stone-50">
                  <img src={selectedImage} alt="Uploaded" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => setSelectedImage(null)}
                      className="bg-white/90 text-red-600 p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <RefreshCw size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Scene Selection */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center text-sm">2</span>
                选择场景
              </h2>
              <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                {SCENES.map((scene) => (
                  <button
                    key={scene.id}
                    onClick={() => setSelectedScene(scene)}
                    className={`relative p-3 rounded-lg border text-left transition-all overflow-hidden group ${
                      selectedScene.id === scene.id 
                        ? 'border-cinnabar ring-1 ring-cinnabar bg-red-50' 
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50'
                    }`}
                  >
                    <div className="font-bold text-sm mb-1">{scene.name}</div>
                    <div className="text-xs text-stone-500 line-clamp-2">{scene.shortDesc}</div>
                    {selectedScene.id === scene.id && (
                      <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-transparent border-r-cinnabar"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Size Selection */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center text-sm">3</span>
                画质选择
              </h2>
              <div className="flex gap-2">
                {[ImageSize.SIZE_1K, ImageSize.SIZE_2K, ImageSize.SIZE_4K].map((size) => (
                  <button
                    key={size}
                    onClick={() => setImageSize(size)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                      imageSize === size
                        ? 'bg-ink-black text-white border-ink-black'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
             {/* Generate Action */}
             <button
              onClick={handleGenerate}
              disabled={!selectedImage || isGenerating}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center gap-2 ${
                !selectedImage || isGenerating
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-cinnabar hover:bg-red-700 text-white transform hover:-translate-y-0.5'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" /> 生成中...
                </>
              ) : (
                <>
                  <Wand2 /> 开始穿越
                </>
              )}
            </button>
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}

          </div>

          {/* Right Column: Result */}
          <div className="lg:col-span-8 flex flex-col h-full">
             <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 flex-grow flex flex-col h-full min-h-[500px]">
                <h2 className="text-lg font-bold mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ImageIcon size={20} className="text-stone-400" />
                    生成结果
                  </span>
                  {generatedImage && (
                    <a 
                      href={generatedImage} 
                      download={`immersive-china-${Date.now()}.png`}
                      className="text-sm flex items-center gap-1 text-cinnabar hover:underline font-medium"
                    >
                      <Download size={16} /> 保存图片
                    </a>
                  )}
                </h2>

                <div className="flex-grow bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-center relative overflow-hidden group">
                  {isGenerating ? (
                    <div className="text-center p-8">
                       <div className="w-20 h-20 border-4 border-cinnabar/30 border-t-cinnabar rounded-full animate-spin mx-auto mb-6"></div>
                       <p className="text-lg font-medium text-stone-700">{loadingStep}</p>
                       <p className="text-sm text-stone-500 mt-2">Gemini 正在绘制中华盛景...</p>
                    </div>
                  ) : generatedImage ? (
                    <img 
                      src={generatedImage} 
                      alt="Generated" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-stone-400 max-w-sm px-4">
                      <div className="mx-auto w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-4 text-stone-300">
                        <ImageIcon size={40} />
                      </div>
                      <h3 className="text-lg font-medium text-stone-500 mb-2">等待生成</h3>
                      <p className="text-sm">
                        请在左侧上传照片并选择一个场景，让 AI 带您进入历史画卷。
                      </p>
                    </div>
                  )}
                </div>
                
                {generatedImage && !isGenerating && (
                  <div className="mt-4 p-4 bg-stone-50 rounded-lg border border-stone-100 text-sm text-stone-600">
                    <p className="font-bold mb-1">已应用场景：{selectedScene.name}</p>
                    <p>{selectedScene.description}</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;