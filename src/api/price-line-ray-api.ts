import { CustomPriceLineRay, PriceLineRayOptions } from '../model/custom-price-line-ray';

import { IPriceLine } from './iprice-line';

export class PriceLineRay implements IPriceLine {
	private readonly _priceLine: CustomPriceLineRay;

	public constructor(priceLine: CustomPriceLineRay) {
		this._priceLine = priceLine;
	}

	public applyOptions(options: Partial<PriceLineRayOptions>): void {
		this._priceLine.applyOptions(options);
	}
	public options(): Readonly<PriceLineRayOptions> {
		return this._priceLine.options();
	}

	public priceLine(): CustomPriceLineRay {
		return this._priceLine;
	}
}
