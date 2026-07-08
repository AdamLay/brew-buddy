import { FormField } from "@/components/ui/FormFields";
import { BATCH_STATUSES, batchSchema } from "@/lib/batches/batch-validation";
import { useRecipeIngredients } from "@/lib/batches/use-batches";
import { zodResolver } from "@hookform/resolvers/zod";
import { Beaker, Save, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormValues = any;

export type BatchIngredient = {
  id: string;
  recipeIngredientId: string;
  ingredient: {
    id: string;
    name: string;
    defaultPrice: number | null;
  };
  recipeIngredient: {
    amount: number;
    unit: string;
  };
  price: number | null;
};

export type Batch = {
  id: string;
  recipeId: string;
  startDate?: Date | null;
  endDate?: Date | null;
  status: (typeof BATCH_STATUSES)[number];
  notes?: string | null;
  batchSize?: number | null;
  ogReading?: number | null;
  fgReading?: number | null;
  currentGravity?: number | null;
  ingredients?: BatchIngredient[];
};

export type IngredientPrice = {
  id: string;
  name: string;
  amount: number;
  unit: string;
  defaultPrice: number | null;
  priceOverride: number | null;
  rawValue: string;
  recipeIngredientId: string;
};

interface BatchFormProps {
  batch?: Batch | null;
  recipes: { id: string; name: string }[];
  preselectedRecipeId?: string;
  submitLabel?: string;
  onSubmit: (data: FormValues) => void | Promise<void>;
}

export function BatchForm({
  batch,
  recipes,
  preselectedRecipeId,
  submitLabel = "Create Batch",
  onSubmit,
}: BatchFormProps) {
  const [ingredients, setIngredients] = useState<IngredientPrice[]>([]);
  const [focusedRecipeId, setFocusedRecipeId] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(batchSchema as any),
    defaultValues: {
      recipeId: batch?.recipeId ?? preselectedRecipeId ?? "",
      startDate: batch?.startDate ? new Date(batch.startDate) : undefined,
      endDate: batch?.endDate ? new Date(batch.endDate) : null,
      status: (batch?.status as (typeof BATCH_STATUSES)[number]) ?? "PLANNING",
      notes: batch?.notes ?? "",
      batchSize: batch?.batchSize ?? undefined,
      ogReading: batch?.ogReading ?? undefined,
      fgReading: batch?.fgReading ?? undefined,
      currentGravity: batch?.currentGravity ?? undefined,
    },
  });

  const { control, formState } = form;
  const recipeId = form.watch("recipeId");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;

      const isValid = await form.trigger();
      if (!isValid) {
        isSubmittingRef.current = false;
        return;
      }

      const formValues = form.getValues();
      const ingredientInput = ingredients.map((ing) => ({
        recipeIngredientId: ing.recipeIngredientId,
        priceOverride: ing.priceOverride,
      }));

      isSubmittingRef.current = false;
      onSubmit({ ...formValues, ingredients: ingredientInput });
    },
    [ingredients, form, onSubmit],
  );

  const { data: rawIngredients, isLoading: ingredientsLoading } = useRecipeIngredients(
    recipeId || "",
  );

  useEffect(() => {
    if (!rawIngredients) {
      setIngredients([]);
      return;
    }

    // Build a map of saved batch ingredient price overrides by recipeIngredientId
    const savedOverrides = new Map<string, number | null>();
    if (batch?.ingredients) {
      for (const bi of batch.ingredients) {
        savedOverrides.set(bi.recipeIngredientId, bi.price);
      }
    }

    const mapped: IngredientPrice[] = rawIngredients.map((ri: any) => {
      const priceOverride = savedOverrides.get(ri.id);
      const overrideVal = priceOverride !== undefined ? priceOverride : null;
      return {
        id: ri.ingredient.id,
        name: ri.ingredient.name,
        amount: ri.amount,
        unit: ri.unit,
        defaultPrice: ri.ingredient.defaultPrice,
        priceOverride: overrideVal,
        rawValue:
          overrideVal !== null
            ? overrideVal.toFixed(2)
            : ri.ingredient.defaultPrice != null
              ? ri.ingredient.defaultPrice.toFixed(2)
              : "",
        recipeIngredientId: ri.id,
      };
    });
    setIngredients(mapped);
  }, [rawIngredients, batch?.ingredients]);

  const handlePriceChange = useCallback((recipeIngredientId: string, value: string) => {
    const parsed = value === "" ? null : parseFloat(value);
    setIngredients((prev) =>
      prev.map((ing) =>
        ing.recipeIngredientId === recipeIngredientId
          ? { ...ing, priceOverride: parsed, rawValue: value }
          : ing,
      ),
    );
  }, []);

  const handleBlurPrice = useCallback((recipeIngredientId: string) => {
    setIngredients((prev) =>
      prev.map((ing) => {
        if (ing.recipeIngredientId !== recipeIngredientId) return ing;
        const raw = parseFloat(ing.rawValue);
        if (ing.rawValue === "" || !isNaN(raw)) {
          const displayVal = ing.rawValue === "" ? "" : raw.toFixed(2);
          return { ...ing, rawValue: displayVal };
        }
        return { ...ing, rawValue: "" };
      }),
    );
    setFocusedRecipeId(null);
  }, []);

  const handleUseDefault = useCallback(
    (recipeIngredientId: string) => {
      setIngredients((prev) =>
        prev.map((ing) =>
          ing.recipeIngredientId === recipeIngredientId
            ? {
                ...ing,
                priceOverride: null,
                rawValue: ing.defaultPrice != null ? ing.defaultPrice.toFixed(2) : "",
              }
            : ing,
        ),
      );
    },
    [ingredients],
  );

  const calculateCost = useCallback((ing: IngredientPrice): number => {
    const price = ing.priceOverride ?? ing.defaultPrice ?? 0;
    return price * ing.amount;
  }, []);

  const total = ingredients.reduce((sum, ing) => sum + calculateCost(ing), 0);

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            label="Recipe"
            htmlFor="batch-recipe"
            required
            error={formState.errors.recipeId as any}
          >
            <Controller
              name="recipeId"
              control={control}
              render={({ field }) => (
                <select id="batch-recipe" {...field} className="select select-bordered w-full">
                  <option value="">Select a recipe...</option>
                  {recipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              )}
            />
          </FormField>

          <FormField label="Status" htmlFor="batch-status" error={formState.errors.status as any}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <select id="batch-status" {...field} className="select select-bordered w-full">
                  {BATCH_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              )}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Date" htmlFor="batch-start-date">
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <input
                    id="batch-start-date"
                    {...field}
                    type="date"
                    value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                    onChange={(e) => {
                      field.onChange(e.target.value ? new Date(e.target.value) : null);
                    }}
                    className="input input-bordered w-full"
                  />
                )}
              />
            </FormField>

            <FormField label="End Date" htmlFor="batch-end-date">
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <input
                    id="batch-end-date"
                    {...field}
                    type="date"
                    className="input input-bordered w-full"
                    value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                  />
                )}
              />
            </FormField>
          </div>

          <FormField label="Batch Size (liters)" htmlFor="batch-size">
            <Controller
              name="batchSize"
              control={control}
              render={({ field }) => (
                <input
                  id="batch-size"
                  {...field}
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="e.g. 5"
                  className="input input-bordered w-full"
                />
              )}
            />
          </FormField>

          <div className="divider pt-0">
            <span className="text-sm text-base-content/50">Gravity Readings</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField label="OG" htmlFor="batch-og">
              <Controller
                name="ogReading"
                control={control}
                render={({ field }) => (
                  <input
                    id="batch-og"
                    {...field}
                    type="number"
                    step="0.001"
                    placeholder="1.050"
                    className="input input-bordered w-full"
                  />
                )}
              />
            </FormField>

            <FormField label="FG" htmlFor="batch-fg">
              <Controller
                name="fgReading"
                control={control}
                render={({ field }) => (
                  <input
                    id="batch-fg"
                    {...field}
                    type="number"
                    step="0.001"
                    placeholder="1.010"
                    className="input input-bordered w-full"
                  />
                )}
              />
            </FormField>

            <FormField label="Current" htmlFor="batch-current">
              <Controller
                name="currentGravity"
                control={control}
                render={({ field }) => (
                  <input
                    id="batch-current"
                    {...field}
                    type="number"
                    step="0.001"
                    placeholder="— "
                    className="input input-bordered w-full"
                  />
                )}
              />
            </FormField>
          </div>

          <FormField label="Notes" htmlFor="batch-notes">
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <textarea
                  id="batch-notes"
                  {...field}
                  className="textarea textarea-bordered w-full h-24"
                  placeholder="Optional notes about this batch..."
                />
              )}
            />
          </FormField>
        </div>

        {/* Ingredient Price Table */}
        {ingredientsLoading && (
          <div className="text-center py-4 text-base-content/50">Loading ingredients...</div>
        )}

        {ingredients.length > 0 && (
          <>
            <div className="divider pt-0">
              <span className="text-sm text-base-content/50">Ingredient Costs</span>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr className="border-base-300">
                    <th className="w-1/3">Ingredient</th>
                    <th className="w-24">Amount</th>
                    <th className="w-32">Unit Price (£)</th>
                    <th className="w-24">Cost</th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {ingredients.map((ing) => {
                    const cost = calculateCost(ing);
                    const hasOverride = ing.priceOverride !== null;
                    const hasDefault = ing.defaultPrice != null;

                    return (
                      <tr key={ing.recipeIngredientId} className="bg-base-100">
                        <td className="font-medium">{ing.name}</td>
                        <td>
                          <div className="text-sm">
                            {ing.amount} {ing.unit}
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-1">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder={hasDefault ? `£${ing.defaultPrice!.toFixed(2)}` : "—"}
                              className="input input-bordered input-xs flex-1 min-w-0"
                              value={
                                focusedRecipeId === ing.recipeIngredientId
                                  ? ing.rawValue
                                  : hasOverride && ing.priceOverride != null
                                    ? ing.priceOverride.toFixed(2)
                                    : ing.defaultPrice != null
                                      ? ing.defaultPrice.toFixed(2)
                                      : ""
                              }
                              onChange={(e) => {
                                setFocusedRecipeId(ing.recipeIngredientId);
                                handlePriceChange(ing.recipeIngredientId, e.target.value);
                              }}
                              onBlur={() => handleBlurPrice(ing.recipeIngredientId)}
                              onFocus={(e) => {
                                if (!hasOverride && hasDefault) {
                                  e.target.select();
                                }
                              }}
                            />
                            {hasDefault && hasOverride && (
                              <button
                                type="button"
                                className="btn btn-ghost btn-xs btn-square"
                                title="Reset to default"
                                onClick={() => handleUseDefault(ing.recipeIngredientId)}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="font-mono text-sm">£{cost.toFixed(2)}</td>
                        <td></td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-primary font-bold text-primary-content">
                    <td colSpan={3} className="text-right pr-4">
                      Total Ingredient Cost:
                    </td>
                    <td className="text-lg">£{total.toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary mt-4">
          {submitLabel.includes("Create") ? (
            <>
              <Beaker className="w-4 h-4 mr-1" />
              {submitLabel}
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-1" />
              {submitLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
