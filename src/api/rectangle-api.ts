import { CustomRectangle, RectangleOptions } from '../model/custom-rectangle';

import { IRectangle } from './irectangle';

export class Rectangle implements IRectangle {
	private readonly _rect: CustomRectangle;

	public constructor(priceLine: CustomRectangle) {
		this._rect = priceLine;
	}

	public applyOptions(options: Partial<RectangleOptions>): void {
		this._rect.applyOptions(options);
	}
	public options(): Readonly<RectangleOptions> {
		return this._rect.options();
	}

	public rectangle(): CustomRectangle {
		return this._rect;
	}
}
