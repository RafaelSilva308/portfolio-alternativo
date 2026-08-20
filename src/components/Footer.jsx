import { profile } from "../data/profile";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <span>{profile.name}</span>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </div>
    </footer>
  );
}
