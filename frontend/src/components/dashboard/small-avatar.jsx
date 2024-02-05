export default function SmallAvatar({ text }) {
  return (
    <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs">
      {" "}
      {text.toUpperCase()}{" "}
    </div>
  );
}
