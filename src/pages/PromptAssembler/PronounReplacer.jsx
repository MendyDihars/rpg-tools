import { useState, useEffect, useRef } from 'react';
import { inputBase } from './constants';

export default function PronounReplacer({ text, selectedCharacters, onReplace, textareaRef, onPronounPositionChange, onActiveChange, sharedState, setSharedState, showButton = true }) {
  // Use local state if sharedState is not provided
  const [localIsActive, setLocalIsActive] = useState(false);
  const [localTotalPronounsFound, setLocalTotalPronounsFound] = useState(0);
  const [localRemainingPronouns, setLocalRemainingPronouns] = useState([]);
  const localProcessedCountRef = useRef(0);

  // Use shared state if provided, otherwise use local state
  const isActive = sharedState ? sharedState.isActive : localIsActive;
  const totalPronounsFound = sharedState ? sharedState.totalPronounsFound : localTotalPronounsFound;
  const remainingPronouns = sharedState ? sharedState.remainingPronouns : localRemainingPronouns;
  const processedCount = sharedState ? sharedState.processedCount : localProcessedCountRef.current;

  const setIsActive = (value) => {
    if (setSharedState) {
      setSharedState(prev => ({ ...prev, isActive: value }));
    } else {
      setLocalIsActive(value);
    }
  };
  const setTotalPronounsFound = (value) => {
    if (setSharedState) {
      setSharedState(prev => ({ ...prev, totalPronounsFound: value }));
    } else {
      setLocalTotalPronounsFound(value);
    }
  };
  const setRemainingPronouns = (value) => {
    if (setSharedState) {
      setSharedState(prev => ({ ...prev, remainingPronouns: value }));
    } else {
      setLocalRemainingPronouns(value);
    }
  };
  const incrementProcessedCount = () => {
    if (setSharedState) {
      setSharedState(prev => ({ ...prev, processedCount: prev.processedCount + 1 }));
    } else {
      localProcessedCountRef.current += 1;
    }
  };

  // Sync active state with parent
  useEffect(() => {
    if (onActiveChange) {
      onActiveChange(isActive);
    }
  }, [isActive, onActiveChange]);

  // Find all pronouns (il, elle) case-insensitive with word boundaries
  const findAllPronouns = (textToSearch) => {
    if (!textToSearch) return [];
    const regex = /\b(il|elle)\b/gi;
    const matches = [];
    let match;
    
    while ((match = regex.exec(textToSearch)) !== null) {
      matches.push({
        pronoun: match[0],
        index: match.index,
      });
    }
    
    return matches;
  };

  // Recalculate remaining pronouns when text changes
  useEffect(() => {
    const found = findAllPronouns(text);
    setRemainingPronouns(found);
    
    if (!isActive) {
      if (setSharedState) {
        setSharedState(prev => ({ ...prev, processedCount: 0, totalPronounsFound: found.length }));
      } else {
        localProcessedCountRef.current = 0;
        setTotalPronounsFound(found.length);
      }
      if (onPronounPositionChange) {
        onPronounPositionChange(null);
      }
    } else if (found.length === 0) {
      // All pronouns processed
      setIsActive(false);
      if (setSharedState) {
        setSharedState(prev => ({ ...prev, processedCount: 0 }));
      } else {
        localProcessedCountRef.current = 0;
      }
      if (onPronounPositionChange) {
        onPronounPositionChange(null);
      }
    } else if (isActive && found.length > 0 && textareaRef?.current && onPronounPositionChange) {
      // Use setTimeout to ensure textarea is fully rendered with updated text
      setTimeout(() => {
        // Recalculate pronouns from current text to ensure we have correct indices
        const textarea = textareaRef.current;
        if (!textarea) return;
        
        const currentText = textarea.value || text;
        const currentFound = findAllPronouns(currentText);
        
        if (currentFound.length === 0) return;
        
        // Update remaining pronouns with recalculated ones
        setRemainingPronouns(currentFound);
        
        const currentPronoun = currentFound[0];
        
        // Select the pronoun in the textarea to visually highlight it
        const start = currentPronoun.index;
        const end = start + currentPronoun.pronoun.length;
        textarea.setSelectionRange(start, end);
        textarea.focus();
        
        // Calculate position using mirror element
        try {
          // Create a temporary span to measure position
          const styles = window.getComputedStyle(textarea);
          const mirror = document.createElement('div');
          const computedStyles = [
            'fontFamily', 'fontSize', 'fontWeight', 'lineHeight',
            'paddingTop', 'paddingLeft', 'paddingRight', 'paddingBottom',
            'borderTopWidth', 'borderLeftWidth', 'boxSizing', 'width',
            'letterSpacing', 'wordSpacing', 'textIndent', 'whiteSpace'
          ];
          computedStyles.forEach(prop => {
            mirror.style[prop] = styles[prop];
          });
          mirror.style.position = 'absolute';
          mirror.style.visibility = 'hidden';
          mirror.style.whiteSpace = 'pre-wrap';
          mirror.style.wordWrap = 'break-word';
          mirror.style.height = 'auto';
          mirror.style.overflow = 'hidden';
          mirror.style.pointerEvents = 'none';
          
          const textBeforePronoun = currentText.substring(0, start);
          const textPronoun = currentText.substring(start, end);
          
          // Create spans to measure position
          const beforeSpan = document.createElement('span');
          beforeSpan.textContent = textBeforePronoun;
          mirror.appendChild(beforeSpan);
          
          const pronounSpan = document.createElement('span');
          pronounSpan.textContent = textPronoun;
          pronounSpan.style.backgroundColor = 'rgba(251, 191, 36, 0.3)'; // Highlight color
          mirror.appendChild(pronounSpan);
          
          document.body.appendChild(mirror);
          
          const lineHeight = parseFloat(styles.lineHeight) || parseFloat(styles.fontSize) * 1.2;
          const paddingTop = parseFloat(styles.paddingTop) || 0;
          const paddingLeft = parseFloat(styles.paddingLeft) || 0;
          
          // Calculate position
          const lines = textBeforePronoun.split('\n');
          const lineCount = lines.length;
          
          // Get the width of the last line before pronoun
          const lastLineText = lines[lines.length - 1];
          const lastLineSpan = document.createElement('span');
          lastLineSpan.style.font = styles.font;
          lastLineSpan.textContent = lastLineText;
          const tempDiv = document.createElement('div');
          tempDiv.style.position = 'absolute';
          tempDiv.style.visibility = 'hidden';
          tempDiv.style.font = styles.font;
          tempDiv.appendChild(lastLineSpan);
          document.body.appendChild(tempDiv);
          const lastLineWidth = lastLineSpan.offsetWidth;
          document.body.removeChild(tempDiv);
          
          // Get pronoun width
          const pronounWidth = pronounSpan.offsetWidth;
          
          document.body.removeChild(mirror);
          
          const left = paddingLeft + lastLineWidth;
          const top = paddingTop + (lineCount - 1) * lineHeight;
          
          onPronounPositionChange({
            left: left,
            top: top,
            height: lineHeight,
            pronounLeft: left,
            pronounTop: top,
            pronounWidth: pronounWidth,
          });
        } catch (e) {
          console.error('Error calculating pronoun position:', e);
        }
      }, 50);
    }
  }, [text, isActive, textareaRef, onPronounPositionChange]);

  const handleStart = () => {
    const found = findAllPronouns(text);
    
    if (found.length === 0) {
      alert("Aucun pronom 'il' ou 'elle' trouvé dans le texte.");
      return;
    }
    if (!selectedCharacters || selectedCharacters.length === 0) {
      alert("Veuillez sélectionner au moins un personnage.");
      return;
    }
    
    setIsActive(true);
    setTotalPronounsFound(found.length);
    if (setSharedState) {
      setSharedState(prev => ({ ...prev, processedCount: 0, remainingPronouns: found }));
    } else {
      localProcessedCountRef.current = 0;
      setRemainingPronouns(found);
    }
    
    // Trigger position calculation
    if (textareaRef?.current && onPronounPositionChange) {
      setTimeout(() => {
        const currentPronoun = found[0];
        const textarea = textareaRef.current;
        if (!textarea) return;
        
        // Simple calculation for now
        const styles = window.getComputedStyle(textarea);
        const lineHeight = parseFloat(styles.lineHeight) || parseFloat(styles.fontSize) * 1.2;
        const paddingTop = parseFloat(styles.paddingTop) || 0;
        const paddingLeft = parseFloat(styles.paddingLeft) || 0;
        
        const textBeforePronoun = text.substring(0, currentPronoun.index);
        const lines = textBeforePronoun.split('\n');
        
        // Create mirror for accurate measurement
        const mirror = document.createElement('div');
        mirror.style.position = 'absolute';
        mirror.style.visibility = 'hidden';
        mirror.style.whiteSpace = 'pre-wrap';
        mirror.style.font = styles.font;
        mirror.style.width = styles.width;
        mirror.style.padding = styles.padding;
        mirror.textContent = textBeforePronoun;
        document.body.appendChild(mirror);
        
        const lastLine = lines[lines.length - 1];
        const span = document.createElement('span');
        span.textContent = lastLine;
        span.style.font = styles.font;
        mirror.appendChild(span);
        const lastLineWidth = span.offsetWidth;
        
        // Calculate pronoun width before removing mirror
        const pronounSpan = document.createElement('span');
        pronounSpan.textContent = currentPronoun.pronoun;
        pronounSpan.style.font = styles.font;
        mirror.appendChild(pronounSpan);
        const pronounWidth = pronounSpan.offsetWidth;
        
        document.body.removeChild(mirror);
        
        const left = paddingLeft + lastLineWidth;
        const top = paddingTop + (lines.length - 1) * lineHeight;
        
        onPronounPositionChange({
          left: left,
          top: top,
          height: lineHeight,
          pronounLeft: left,
          pronounTop: top,
          pronounWidth: pronounWidth,
        });
      }, 10);
    }
  };

  const handleSelectCharacter = (characterName) => {
    if (!isActive || !characterName || remainingPronouns.length === 0) return;

    const currentPronoun = remainingPronouns[0];
    
    // Apply replacement immediately
    const before = text.substring(0, currentPronoun.index);
    const after = text.substring(currentPronoun.index + currentPronoun.pronoun.length);
    const newText = before + characterName + after;
    
    // Update text - this will trigger a recalculation of pronouns
    onReplace(newText);
    
    // Increment processed count
    incrementProcessedCount();
  };

  const handleCancel = () => {
    setIsActive(false);
    if (setSharedState) {
      setSharedState(prev => ({ ...prev, processedCount: 0 }));
    } else {
      localProcessedCountRef.current = 0;
    }
  };

  // Find current pronoun to display (always the first remaining)
  const currentPronoun = isActive && remainingPronouns.length > 0 
    ? remainingPronouns[0] 
    : null;

  // Show inline selector when active
  if (isActive && currentPronoun && !showButton) {
    return (
      <>
        <span className="text-xs sm:text-sm text-amber-100/70 mr-2 whitespace-nowrap">
          {processedCount + 1}/{totalPronounsFound}:
        </span>
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) {
              handleSelectCharacter(e.target.value);
              e.target.value = ""; // Reset select
            }
          }}
          className={`${inputBase} text-sm sm:text-base w-full sm:w-40 min-h-[44px] touch-manipulation`}
          autoFocus
          style={{ WebkitAppearance: 'menulist' }}
        >
          <option value="">Sélectionner...</option>
          {selectedCharacters.map((char) => (
            <option key={char.id} value={char.name}>
              {char.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleCancel}
          className="text-xs sm:text-sm font-medium text-amber-100/80 hover:text-amber-50 px-2 sm:px-3 py-2 sm:py-1 ml-2 min-h-[44px] touch-manipulation whitespace-nowrap"
        >
          Annuler
        </button>
      </>
    );
  }

  // Show button when not active or when showButton is true
  if (!isActive || !currentPronoun) {
    if (!showButton) return null;
    
    return (
      <button
        type="button"
        onClick={handleStart}
        className="text-xs font-medium text-amber-100/80 hover:text-amber-50 px-2 py-1 rounded border border-amber-300/30 hover:border-amber-300/50"
      >
        Vérifier les noms
      </button>
    );
  }

  return null;
}

