
export interface CollarDesign {
  name: string;
  imageUrl: string;
}

export interface CustomizationOptions {
  fit: string;
  color: string;
  fabric: string;
  collar: CollarDesign;
}
