import { useRef, useState, useEffect, useCallback } from 'react';
import { inputBase } from './constants';
import PronounReplacer from './PronounReplacer';

export default function PromptBodyInput({ value, onChange, selectedCharacters }) {
  const textareaRef = useRef(null);
  const selectorRef = useRef(null);
  const [pronounPosition, setPronounPosition] = useState(null);
  const [isReplacing, setIsReplacing] = useState(false);
  const [selectorStyle, setSelectorStyle] = useState({});
  const [sharedState, setSharedState] = useState({
    isActive: false,
    totalPronounsFound: 0,
    remainingPronouns: [],
    processedCount: 0,
  });

  // Function to calculate and set selector position
  const calculateSelectorPosition = useCallback(() => {
    if (!pronounPosition || !isReplacing || !sharedState.remainingPronouns.length || !textareaRef.current) {
      setSelectorStyle({});
      return;
    }

    if (!selectorRef.current) {
      // Fallback to initial position if selector not yet rendered
      setSelectorStyle({
        left: `${pronounPosition.left}px`,
        top: `${pronounPosition.top + pronounPosition.height + 4}px`,
      });
      return;
    }

    const textarea = textareaRef.current;
    const selector = selectorRef.current;
    const textareaRect = textarea.getBoundingClientRect();
    const selectorRect = selector.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isMobile = viewportWidth < 640;

    // Use the pronoun position directly (already calculated relative to textarea)
    // Don't subtract scroll because pronounPosition is already relative to textarea content
    let left = pronounPosition.left;
    let top = pronounPosition.top + pronounPosition.height + 4; // 4px margin

    const selectorWidth = selectorRect.width || (isMobile ? textareaRect.width - 16 : 200);
    const selectorHeight = selectorRect.height || (isMobile ? 120 : 50);

    // On mobile, center horizontally and use full width
    if (isMobile) {
      left = Math.max(4, (textareaRect.width - selectorWidth) / 2);
    } else {
      // Check if selector goes off right edge
      if (left + selectorWidth > textareaRect.width - 4) {
        left = Math.max(4, textareaRect.width - selectorWidth - 4);
      }
      // Check if selector goes off left edge
      if (left < 4) {
        left = 4;
      }
    }

    // Check if selector goes off bottom edge (relative to viewport)
    // Account for textarea scroll
    const scrollTop = textarea.scrollTop;
    const selectorBottomInViewport = textareaRect.top + top - scrollTop + selectorHeight;
    if (selectorBottomInViewport > viewportHeight - 10) {
      // Position above the pronoun instead
      top = pronounPosition.top - selectorHeight - 4;
      // If still off screen, position at top of textarea
      if (top < 4) {
        top = 4;
      }
    }

    // Ensure selector is visible in viewport (account for scroll)
    const selectorTopInViewport = textareaRect.top + top - scrollTop;
    if (selectorTopInViewport < 10) {
      top = 10 - textareaRect.top + scrollTop;
    }

    setSelectorStyle({
      left: `${left}px`,
      top: `${top}px`,
    });
  }, [pronounPosition, isReplacing, sharedState.remainingPronouns.length]);

  // Adjust selector position to stay within viewport
  useEffect(() => {
    // Wait for selector to be rendered and text to be updated
    const timeoutId = setTimeout(calculateSelectorPosition, 50);

    // Recalculate on scroll
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('scroll', calculateSelectorPosition);
      window.addEventListener('resize', calculateSelectorPosition);
      window.addEventListener('scroll', calculateSelectorPosition);
    }

    return () => {
      clearTimeout(timeoutId);
      if (textarea) {
        textarea.removeEventListener('scroll', calculateSelectorPosition);
        window.removeEventListener('resize', calculateSelectorPosition);
        window.removeEventListener('scroll', calculateSelectorPosition);
      }
    };
  }, [pronounPosition, isReplacing, sharedState.remainingPronouns.length, calculateSelectorPosition]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor="prompt-free-text" className="text-sm font-medium text-amber-100/90">
          Partie libre du prompt
        </label>
        <div className="flex items-center gap-2">
          {selectedCharacters && selectedCharacters.length > 0 && (
            <PronounReplacer
              text={value}
              selectedCharacters={selectedCharacters}
              onReplace={onChange}
              textareaRef={textareaRef}
              onPronounPositionChange={setPronounPosition}
              onActiveChange={setIsReplacing}
              sharedState={sharedState}
              setSharedState={setSharedState}
              showButton={true}
            />
          )}
          {value.trim() && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs font-medium text-amber-100/80 hover:text-amber-50"
            >
              Effacer
            </button>
          )}
        </div>
      </div>
      <div className="relative">
        <textarea
          ref={textareaRef}
          id="prompt-free-text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={6}
          className={`${inputBase} resize-y`}
          placeholder="Décris ici les objectifs, les contraintes ou les éléments spécifiques de la scène."
        />
        {pronounPosition && isReplacing && sharedState.remainingPronouns.length > 0 && (
          <div
            ref={selectorRef}
            className="absolute z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-lg border border-amber-400/40 bg-amber-500/10 max-w-[calc(100%-8px)] shadow-lg"
            style={selectorStyle}
          >
              <PronounReplacer
                text={value}
                selectedCharacters={selectedCharacters}
                onReplace={onChange}
                textareaRef={textareaRef}
                onPronounPositionChange={setPronounPosition}
                onActiveChange={setIsReplacing}
                sharedState={sharedState}
                setSharedState={setSharedState}
                showButton={false}
              />
          </div>
        )}
      </div>
    </div>
  );
}

