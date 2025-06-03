import React from 'react';
import './AllMoments.css';

const AllMoments = ({ moments, onEdit, onDelete }) => {
  if (!moments || moments.length === 0) {
    return (
      <div className="no-moments">
        <div className="magazine-empty-state">
          <h2>No moments yet</h2>
          <p>Start creating your beautiful moments collection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="magazine-layout">
      {moments.map((moment, index) => (
        //____________________________________ ALSO CAN PROVIDE index % 3 === 0 ____________________________________
        <article key={moment.id} className={`magazine-article ${index % 6 === 0 ? 'featured' : ''}`}>
        {/* <article key={moment.id} className={`magazine-article ${index % 3 === 0 ? 'featured' : ''}`}> */}
          <div className="article-number">#{moment.momentNumber}</div>
          
          <div className="article-media">
            {moment.momentImage && (
              <img src={moment.momentImage} alt={moment.momentTitle} className="article-image" />
            )}
          </div>
          
          <div className="article-content">
            <h2 className="article-title">{moment.momentTitle}</h2>
            <div className="article-text" lang="ml">
              <p>{moment.momentContent}</p>
            </div>
            
            <div className="article-actions">
              {onEdit && <button onClick={() => onEdit(moment)} className="btn btn-edit">✏️ Edit</button>}
              {onDelete && <button onClick={() => onDelete(moment)} className="btn btn-delete">🗑️ Delete</button>}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default AllMoments;