import './loading.scss';

interface LoadingProps {
  title: string;
}

export default function Loading({ title }: LoadingProps) {
  return (
    <div className="loading">
      <div className="spinner" />
      <p>{title}</p>
    </div>
  );
}