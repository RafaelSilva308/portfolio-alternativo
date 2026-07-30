import { profile } from "../data/profile";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <a href={profile.github} target="_blank" rel="noreferrer">
          github.com/RafaelSilva308
        </a>
      </div>
    </footer>
  );
}
