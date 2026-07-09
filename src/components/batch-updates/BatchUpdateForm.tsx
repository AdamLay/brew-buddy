import { FormField } from "@/components/ui/FormFields";
import { batchUpdateSchema } from "@/lib/batch-updates/batch-update-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Image as ImageIcon, Save } from "lucide-react";

export interface BatchUpdateFormData {
  timestamp?: Date;
  notes?: string;
  image?: string;
}

interface BatchUpdateFormProps {
  batchId: string;
  onSubmit: (data: { batchId: string; timestamp?: Date; notes?: string; image?: string }) => void;
}

export function BatchUpdateForm({ batchId, onSubmit }: BatchUpdateFormProps) {
  const form = useForm<BatchUpdateFormData & { batchId?: string }>({
    resolver: zodResolver(batchUpdateSchema as any),
    defaultValues: {
      batchId,
      timestamp: new Date(),
      notes: "",
      image: "",
    },
  });

  const { control, reset } = form;

  const handleSubmit = (data: BatchUpdateFormData & { batchId?: string }) => {
    onSubmit({
      batchId,
      timestamp: data.timestamp || new Date(),
      notes: data.notes || "",
      image: data.image,
    });
    reset({
      batchId,
      timestamp: new Date(),
      notes: "",
      image: "",
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Timestamp" htmlFor="update-timestamp">
            <Controller
              name="timestamp"
              control={control}
              render={({ field }) => (
                <input
                  id="update-timestamp"
                  {...field}
                  type="datetime-local"
                  value={
                    field.value
                      ? new Date(field.value)
                          .toISOString()
                          .slice(0, 16)
                          .replace("T", "T")
                          .replace(/\.\d+/, "")
                          .slice(0, 16)
                      : ""
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                  className="input input-bordered w-full"
                />
              )}
            />
          </FormField>

          <FormField label="Photo" htmlFor="update-image">
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1">
                  <label htmlFor="update-image" className="label cursor-pointer">
                    <input
                      type="file"
                      id="update-image"
                      accept="image/*"
                      className="file-input file-input-bordered w-full flex-1"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const base64String = reader.result as string;
                            form.setValue("image", base64String, { shouldValidate: true });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {field.value && (
                    <span className="text-xs text-base-content/50 mt-1">
                      <ImageIcon className="w-3 h-3 inline mr-1" />
                      Image attached
                    </span>
                  )}
                </div>
              )}
            />
          </FormField>
        </div>

        <FormField label="Notes" htmlFor="update-notes">
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <textarea
                id="update-notes"
                {...field}
                className="textarea textarea-bordered w-full h-24 resize-y"
                placeholder="What happened since the last update?"
              />
            )}
          />
        </FormField>

        <button type="submit" className="btn btn-primary w-full sm:w-auto">
          <Save className="w-4 h-4 mr-1" />
          Add Update
        </button>
      </div>
    </form>
  );
}
