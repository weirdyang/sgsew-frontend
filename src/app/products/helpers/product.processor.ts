import { FormGroup } from "@angular/forms";

export const constructFormData = function (form: FormGroup): FormData {
    const formData: FormData = new FormData();

    const { name, description, file, productType, brand, price } = form.value;
    console.log(price);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("productType", productType);
    formData.append("brand", brand);
    formData.append("price", price.replace(/[^\d.-]/g, ''));
    if (file) {
        formData.append('file', file);
    }
    return formData;
}