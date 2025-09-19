import { useEffect } from 'react';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const GoogleTranslate = () => {
  useEffect(() => {
    // Ensure the Google Translate widget is properly initialized
    if (window.google && window.google.translate) {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'hi,bn,te,mr,ta,gu,ur,kn,or,ml,pa,as,mai,sa,ne,gom,sd,doi,mni,brx,sat,ks,en',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
      }, 'google_translate_element');
    }
  }, []);

  const handleTranslateClick = () => {
    const translateElement = document.getElementById('google_translate_element');
    if (translateElement) {
      const selectElement = translateElement.querySelector('select');
      if (selectElement) {
        selectElement.focus();
        selectElement.click();
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleTranslateClick}
        className="flex items-center gap-2 text-sm"
      >
        <Languages className="w-4 h-4" />
        <span className="hidden sm:inline">Translate</span>
      </Button>
      <div id="google_translate_element" className="hidden"></div>
    </div>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}