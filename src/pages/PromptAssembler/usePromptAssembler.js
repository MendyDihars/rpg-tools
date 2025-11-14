import { useEffect, useMemo, useState } from 'react';
import { CHARACTERS, DEFAULT_LOCATIONS, WEATHER_OPTIONS, CONTEXT_TEMPLATE, CONCLUSION_TEMPLATE } from './constants';
import { readStoredConfig, writeStoredConfig } from './storage';

export function usePromptAssembler() {
  const [promptBody, setPromptBody] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [customDescriptions, setCustomDescriptions] = useState({});
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locationDescriptions, setLocationDescriptions] = useState({});
  const [selectedWeather, setSelectedWeather] = useState([]);
  const [hasReferenceImage, setHasReferenceImage] = useState(false);
  const [customCharacters, setCustomCharacters] = useState([]);
  const [customLocations, setCustomLocations] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load config from localStorage on mount
  useEffect(() => {
    const stored = readStoredConfig();
    if (stored) {
      if (stored.descriptions) setCustomDescriptions(stored.descriptions);
      if (stored.selectedLocation) setSelectedLocation(stored.selectedLocation);
      if (stored.hasReferenceImage !== undefined) setHasReferenceImage(stored.hasReferenceImage);
      if (stored.customCharacters && Array.isArray(stored.customCharacters)) {
        setCustomCharacters(stored.customCharacters);
      }
      if (stored.selectedIds && Array.isArray(stored.selectedIds)) {
        setSelectedIds(stored.selectedIds);
      }
      if (stored.promptBody) setPromptBody(stored.promptBody);
      if (stored.locationDescriptions) setLocationDescriptions(stored.locationDescriptions);
      if (stored.customLocations && Array.isArray(stored.customLocations)) {
        setCustomLocations(stored.customLocations);
      }
      if (stored.selectedWeather) {
        if (typeof stored.selectedWeather === 'string') {
          setSelectedWeather([stored.selectedWeather]);
        } else if (Array.isArray(stored.selectedWeather)) {
          setSelectedWeather(stored.selectedWeather);
        }
      }
      if (stored.generatedPrompt) setGeneratedPrompt(stored.generatedPrompt);
    }
    setIsInitialLoad(false);
  }, []);

  // Save config to localStorage whenever it changes
  useEffect(() => {
    if (isInitialLoad) return;
    
    const config = {
      descriptions: customDescriptions,
      selectedLocation,
      locationDescriptions,
      selectedWeather,
      hasReferenceImage,
      customCharacters,
      customLocations,
      selectedIds,
      promptBody,
      generatedPrompt,
    };
    writeStoredConfig(config);
  }, [customDescriptions, selectedLocation, locationDescriptions, selectedWeather, hasReferenceImage, customCharacters, customLocations, selectedIds, promptBody, generatedPrompt, isInitialLoad]);

  const allCharacters = useMemo(
    () => [...CHARACTERS, ...customCharacters],
    [customCharacters]
  );

  const allLocations = useMemo(
    () => [...DEFAULT_LOCATIONS, ...customLocations],
    [customLocations]
  );

  const selectedCharacters = useMemo(
    () => allCharacters.filter((c) => selectedIds.includes(c.id)),
    [selectedIds, allCharacters]
  );

  const effectiveDescriptions = useMemo(() => {
    const map = {};
    allCharacters.forEach((character) => {
      map[character.id] = customDescriptions[character.id] ?? character.defaultDescription;
    });
    return map;
  }, [customDescriptions, allCharacters]);

  const updateCharacterDescription = (id, value) => {
    setCustomDescriptions((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const resetCharacterDescription = (id, defaultDescription) => {
    setCustomDescriptions((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleAddCustomCharacter = (character) => {
    setCustomCharacters((prev) => [...prev, character]);
  };

  const handleDeleteCustomCharacter = (id) => {
    setCustomCharacters((prev) => prev.filter((c) => c.id !== id));
    setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    setCustomDescriptions((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleAddCustomLocation = (location) => {
    setCustomLocations((prev) => [...prev, location]);
  };

  const handleDeleteCustomLocation = (id) => {
    setCustomLocations((prev) => prev.filter((l) => l.id !== id));
    if (selectedLocation === id) {
      setSelectedLocation("");
    }
    setLocationDescriptions((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const updateLocationDescription = (locationId, value) => {
    if (value === undefined) {
      setLocationDescriptions((prev) => {
        const updated = { ...prev };
        delete updated[locationId];
        return updated;
      });
    } else {
      setLocationDescriptions((prev) => ({
        ...prev,
        [locationId]: value,
      }));
    }
  };

  const handleGenerate = () => {
    const sections = [];

    if (CONTEXT_TEMPLATE.trim()) {
      sections.push(`${CONTEXT_TEMPLATE.trim()}`);
    }

    if (selectedCharacters.length > 0) {
      const characterLines = selectedCharacters
        .map((character) => `- ${character.name} : ${effectiveDescriptions[character.id].trim()}`)
        .join("\n\n");
      sections.push(`${characterLines}`);
    }

    if (promptBody.trim()) {
      let body = promptBody.trim();
      if (selectedWeather.length > 0) {
        const weatherDescriptions = selectedWeather
          .map((weatherId) => {
            const weather = WEATHER_OPTIONS.find((w) => w.id === weatherId);
            return weather ? weather.description : null;
          })
          .filter(Boolean);
        
        if (weatherDescriptions.length > 0) {
          body += `. ${weatherDescriptions.join(' ')}`;
        }
      }
      sections.push(`Voici l'image à générer : ${body}`);
    }

    if (selectedLocation) {
      const location = allLocations.find((l) => l.id === selectedLocation);
      if (location) {
        const locationDescription = locationDescriptions[selectedLocation] ?? location.defaultDescription;
        sections.push(`La scène se déroule dans le lieu suivant : ${locationDescription}`);
      }
    }

    if (hasReferenceImage) {
      sections.push(`Appuie toi sur l'image en référence pour générer l'image, la pose et les expressions.`);
    }

    if (CONCLUSION_TEMPLATE.trim()) {
      sections.push(`${CONCLUSION_TEMPLATE.trim()}`);
    }

    setGeneratedPrompt(sections.join("\n\n"));
  };

  return {
    // State
    promptBody,
    selectedIds,
    customDescriptions,
    generatedPrompt,
    selectedLocation,
    locationDescriptions,
    selectedWeather,
    hasReferenceImage,
    customCharacters,
    customLocations,
    allCharacters,
    allLocations,
    selectedCharacters,
    effectiveDescriptions,
    // Setters
    setPromptBody,
    setSelectedIds,
    setGeneratedPrompt,
    setSelectedLocation,
    setSelectedWeather,
    setHasReferenceImage,
    // Handlers
    updateCharacterDescription,
    resetCharacterDescription,
    handleAddCustomCharacter,
    handleDeleteCustomCharacter,
    handleAddCustomLocation,
    handleDeleteCustomLocation,
    updateLocationDescription,
    handleGenerate,
  };
}

