export const convertToFormData = (data: Record<string, unknown>): FormData => {
  const formData = new FormData();

  const appendFormData = (value: unknown, parentKey: string | null = null) => {
    if (
      value &&
      typeof value === "object" &&
      !(value instanceof Date) &&
      !(value instanceof File)
    ) {
      if (Array.isArray(value)) {
        const arr = value as unknown[];
        const allFiles = arr.every((item) => item instanceof File);

        if (allFiles) {
          arr.forEach((file) => {
            if (parentKey) {
              formData.append(parentKey, file as File);
            }
          });
        } else if (arr.every((item) => typeof item === "string") && parentKey) {
          // String arrays: repeat the same key so the server receives an array
          arr.forEach((item) => formData.append(parentKey, item as string));
        } else {
          arr.forEach((item, index) => {
            const key = parentKey ? `${parentKey}[${index}]` : String(index);
            appendFormData(item, key);
          });
        }
      } else {
        const obj = value as Record<string, unknown>;
        Object.keys(obj).forEach((key) => {
          const val = obj[key];
          const newKey = parentKey ? `${parentKey}[${key}]` : key;
          appendFormData(val, newKey);
        });
      }
    } else {
      if (parentKey !== null) {
        if (value === null || value === undefined) {
          formData.append(parentKey, "");
        } else if (value instanceof File || value instanceof Blob) {
          formData.append(parentKey, value as Blob);
        } else if (value instanceof Date) {
          formData.append(parentKey, value.toISOString());
        } else {
          formData.append(parentKey, String(value));
        }
      }
    }
  };

  appendFormData(data);
  return formData;
};
