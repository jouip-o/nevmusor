import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/site";

export function MapFavorite({ saved, signedIn, disabled, error, onToggle }: {
  saved: boolean;
  signedIn: boolean;
  disabled: boolean;
  error: string;
  onToggle: () => void;
}) {
  const { lang } = useI18n();
  const ru = lang === "ru";
  const label = !signedIn
    ? (ru ? "Войти, чтобы сохранить в избранное" : "Sign in to save a favourite")
    : saved
      ? (ru ? "Убрать из избранного" : "Remove from favourites")
      : (ru ? "Добавить в избранное" : "Add to favourites");
  return (
    <>
      <Button asChild={!signedIn} type="button" variant="ghost" size="icon"
        className={`map-favorite${saved ? " is-saved" : ""}`}
        title={label} aria-label={label} aria-pressed={signedIn ? saved : undefined}
        disabled={signedIn && disabled} onClick={signedIn ? onToggle : undefined}>
        {signedIn ? <Star aria-hidden="true" /> : <Link to="/account"><Star aria-hidden="true" /></Link>}
      </Button>
      {error ? <span className="map-favorite-error" role="alert">{ru ? "Не удалось сохранить. Попробуйте ещё раз." : "Could not save. Please try again."}</span> : null}
    </>
  );
}