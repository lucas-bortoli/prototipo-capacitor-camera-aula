interface ScanResultsViewProps {
  scanContent: string;
  goBackToScanner: () => void;
}

export default function ScanResultsView(props: ScanResultsViewProps) {
  return (
    <section class="flex h-full w-full flex-col gap-2 bg-white-0 p-8">
      <h1 class="text-4xl">Dados do scan</h1>
      <textarea readOnly class="h-1/2 w-full border border-white-300 p-8">
        {props.scanContent}
      </textarea>
      <button
        class="shadow-pixel-sm rounded-md border-2 border-white-800 bg-white-100 px-4 py-2 font-bold active:translate-x-[2px] active:translate-y-[2px] active:bg-white-200 active:shadow-none"
        onClick={props.goBackToScanner}>
        Voltar
      </button>
    </section>
  );
}
