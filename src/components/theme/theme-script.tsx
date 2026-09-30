export const themeInitializer = `(()=>{let theme="light";try{const saved=localStorage.getItem("vafedev-theme");if(saved==="light"||saved==="dark")theme=saved}catch{}document.documentElement.dataset.theme=theme})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeInitializer }} />;
}
