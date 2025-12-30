import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [steps, setSteps] = useState(30);
  const [cfgScale, setCfgScale] = useState(7);

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');
    setImageBase64('');

   

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/images/generate`,
  {
          prompt,
          width,
          height,
          steps,
          cfgScale
        }
      );

      if (response.data.status === 'success') {
        setImageBase64(response.data.imageBase64);
      } else {
        setError(response.data.message || 'Failed to generate image');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(
        err.response?.data?.message ||
          'Failed to generate image. Check your API key and internet connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = imageBase64;
    link.download = `ai-image-${Date.now()}.png`;
    link.click();
  };

  const clearAll = () => {
    setPrompt('');
    setImageBase64('');
    setError('');
  };

  const examplePrompts = [
    'A futuristic city with flying cars at sunset',
    'A playful kitten exploring a spaceship',
    
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1> AI Image Generator</h1>
      </header>

      <div className="container">
        <div className="input-section">
          <label>Describe your image:</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt "
            rows="4"
            disabled={loading}
          />

          <div className="example-prompts">
            <small>Try these:</small>
            <div className="prompts-grid">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  className="example-btn"
                  onClick={() => setPrompt(example)}
                  disabled={loading}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div className="advanced-section">
            <button
              className="toggle-advanced"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? '▼' : '▶'} Advanced Settings
            </button>

            {showAdvanced && (
              <div className="advanced-controls">
                <div className="control-group">
                  <label>Width: {width}px</label>
                  <input
                    type="range"
                    min="512"
                    max="2048"
                    step="64"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                  />
                </div>

                <div className="control-group">
                  <label>Height: {height}px</label>
                  <input
                    type="range"
                    min="512"
                    max="2048"
                    step="64"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                  />
                </div>

                <div className="control-group">
                  <label>Steps: {steps}</label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={steps}
                    onChange={(e) => setSteps(Number(e.target.value))}
                  />
                </div>

                <div className="control-group">
                  <label>CFG Scale: {cfgScale}</label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={cfgScale}
                    onChange={(e) => setCfgScale(Number(e.target.value))}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="button-group">
            <button
              onClick={generateImage}
              disabled={loading}
              className="generate-btn"
            >
              {loading ? ' Generating... (30–60s)' : ' Generate Image'}
            </button>

            <button
              onClick={clearAll}
              disabled={loading}
              className="clear-btn"
            >
               Clear
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <strong>❌ Error:</strong> {error}
          </div>
        )}

        {loading && (
          <div className="loading-message">
            <div className="spinner"></div>
            <p>Creating your masterpiece... Please wait 30–60 seconds</p>
          </div>
        )}

        {imageBase64 && !loading && (
          <div className="result-section">
            <h3> Your Generated Image:</h3>
            <div className="image-container">
              <img src={imageBase64} alt="Generated" />
            </div>
            <div className="image-info">
              <p>
                <strong>Prompt:</strong> {prompt}
              </p>
              <p>
                <strong>Size:</strong> {width} × {height}px
              </p>
            </div>
            <button onClick={downloadImage} className="download-btn">
               Download Image
            </button>
          </div>
        )}
      </div>

      
    </div>
  );
}

export default App;
