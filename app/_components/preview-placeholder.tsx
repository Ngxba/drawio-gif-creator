export function PreviewPlaceholder() {
  return (
    <div className="bg-card border-border rounded-lg p-12 flex flex-col items-center justify-center border-2 border-dashed flex-1">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-secondary dark:bg-muted rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground">Preview Area</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Upload a draw.io file and click convert to see your animated GIF here
        </p>
      </div>
    </div>
  );
}
