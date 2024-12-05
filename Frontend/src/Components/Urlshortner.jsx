import React, { useState } from 'react';

export const Urlshortner = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  const handleInputChange = (e) => {
    setLongUrl(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!longUrl) {
      setError('Please enter a URL.');
      return;
    }
    setError('');
    setCopySuccess('');
    
    
    const mockShortenedUrl = `https://short.ly/${btoa(longUrl).slice(0, 6)}`;
    
    setShortUrl(mockShortenedUrl);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl)
      .then(() => {
        setCopySuccess('URL copied to clipboard!');
        setTimeout(() => setCopySuccess(''), 3000); 
      })
      .catch(() => {
        setError('Failed to copy the URL');
      });
  };

  return (
    <div className="container-lg mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <h3 className="text-center head "><i>URL Shortener</i></h3>
          <h4></h4>
          <form className="rounded" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="urlInput" className="form-label h4 mb-4 mt-4 label">
                Enter your URL:
              </label>
              <input
                id="urlInput"
                className="form-control w-75 m-auto"
                required
                value={longUrl}
                onChange={handleInputChange}
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary w-75 m-auto mb-5">
                Shorten URL
              </button>
            </div>
          </form>
          {error && <p style={{ color: 'red' }}><button className='btn btn-secondary w-50'>{error}</button></p>}
          {shortUrl && (
            <div className="mt-4 text-center">
              <h3>Shortened URL:</h3>
              <div className="d-flex justify-content-center align-items-center">
                <a
                  href={shortUrl}
                  target="_blank"
                  className="me-3"
                >
                  {shortUrl}
                </a>
                <button
                  className="btn btn-secondary"
                  onClick={handleCopy}
                  style={{ display: 'block', opacity: 1 }}
                >
                  Copy
                </button>
              </div>
              {copySuccess && <p style={{ color: 'green' }}>{copySuccess}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
