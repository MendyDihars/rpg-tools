import { WEATHER_OPTIONS } from './constants';

export default function WeatherSelector({ selectedWeather, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-amber-100/90">
        Météo
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {WEATHER_OPTIONS.map((weather) => {
          const isSelected = selectedWeather.includes(weather.id);
          return (
            <label
              key={weather.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? "border-amber-400/60 bg-amber-500/20 shadow-[0_0_0_2px_rgba(212,175,55,0.2)]"
                  : "border-amber-300/30 bg-zinc-900/60 hover:border-amber-300/50"
              }`}
            >
              <input
                type="checkbox"
                value={weather.id}
                checked={isSelected}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...selectedWeather, weather.id]);
                  } else {
                    onChange(selectedWeather.filter((id) => id !== weather.id));
                  }
                }}
                className="sr-only"
              />
              <span className="text-lg">{weather.emoji}</span>
              <span className="text-sm text-amber-50">{weather.label}</span>
            </label>
          );
        })}
      </div>
      {selectedWeather.length > 0 && (
        <button
          type="button"
          onClick={() => onChange([])}
          className="text-xs font-medium text-amber-100/80 hover:text-amber-50 self-start"
        >
          Effacer la sélection
        </button>
      )}
    </div>
  );
}

