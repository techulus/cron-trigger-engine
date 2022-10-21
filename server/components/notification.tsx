import { InformationCircleIcon } from '@heroicons/react/20/solid';

export function InlineErrorMessage({ message }: { message: string }) {
  return (
    <div className="rounded-md bg-red-50 p-2 max-w-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon
            className="h-5 w-5 text-red-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-red-700">{message}</p>
        </div>
      </div>
    </div>
  );
}
