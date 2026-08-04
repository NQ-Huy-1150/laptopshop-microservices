package com.laptopshop.inventoryservice.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateStockRequest {
    @NotNull(message = "PRODUCT_ID_NPE")
    @NotEmpty(message = "PRODUCT_ID_INVALID")
    String productId;
    @Min(value = 1, message = "QUANTITY_INVALID")
    long quantity;
    @NotEmpty(message = "UPDATE_TYPE_INVALID")
    String updateType;
    @NotEmpty(message = "DESCRIPTION_INVALID")
    String description;
}
