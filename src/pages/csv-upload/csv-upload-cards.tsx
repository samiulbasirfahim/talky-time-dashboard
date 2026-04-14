import { FileText, Upload } from "lucide-react";
import { AppButton } from "../../components/button";
import { AppText } from "../../components/text";

export function CsvUploadCards() {
    return (
        <div className="p-4">
            <div className="flex w-full items-center justify-center rounded-xl border border-dashed border-text-focus/25 py-12">
                <div className="flex flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bg-focus text-text-focus">
                        <Upload size={24} />
                    </div>

                    <AppText variant="smallHeader" className="mt-4 text-center text-text">
                        Drag & drop CSV files
                    </AppText>

                    <AppText variant="description" className="mt-2 text-center text-text-muted">
                        or click to browse · Multiple files supported
                    </AppText>

                    <AppButton variant="focus" size="sm" prefixIcon={FileText} className="mt-4 rounded-lg px-6 py-2 text-sm font-semibold">
                        Browse Files
                    </AppButton>

                    <AppText variant="description" className="mt-4 text-center text-xs text-text-muted/60">
                        Accepted format: .csv · Max file size: 10MB
                    </AppText>
                </div>
            </div>
        </div>
    );
}
