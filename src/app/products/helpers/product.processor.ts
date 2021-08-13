import { FormGroup } from "@angular/forms";

export const constructFormData = function (form: FormGroup): FormData {
    const formData: FormData = new FormData();

    const { name, description, file, productType, brand, price } = form.value;
    console.log(price, 'construct');
    formData.append("name", name);
    formData.append("description", description);
    formData.append("productType", productType);
    formData.append("brand", brand);
    formData.append("price", processCurrency(price));

    if (file) {
        formData.append('file', file);
    }
    return formData;
}

export const processCurrency = function (value: string): string {
    value = value.toString();
    const result = Number(value.replace(/[^\d.-]/g, ''));
    if (isNaN(result)) {
        return value
    }
    return result.toFixed(2);
}