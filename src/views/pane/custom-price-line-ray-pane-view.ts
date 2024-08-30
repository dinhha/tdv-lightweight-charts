import { CustomPriceLineRay } from '../../model/custom-price-line-ray';
import { ISeries } from '../../model/series';
import { SeriesType } from '../../model/series-options';

import { SeriesHorizontalRayPaneView } from './series-horizontal-ray-pane-view';

export class CustomPriceLineRayPaneView extends SeriesHorizontalRayPaneView {
	private readonly _priceLine: CustomPriceLineRay;

	public constructor(series: ISeries<SeriesType>, priceLine: CustomPriceLineRay) {
		super(series);
		this._priceLine = priceLine;
	}

	protected _updateImpl(): void {
		const data = this._lineRendererData;
		data.visible = false;

		const lineOptions = this._priceLine.options();

		if (!this._series.visible() || !lineOptions.lineVisible) {
			return;
		}

		const y = this._priceLine.yCoord();
		const x0 = this._priceLine.x0Coord();
		const x1 = this._priceLine.x1Coord();

		if (y === null || x0 === null) {
			return;
		}

		data.visible = true;
		data.y = y;
		data.x0 = x0;
		data.x1 = x1 != null ? x1 : undefined;
		data.color = lineOptions.color;
		data.lineWidth = lineOptions.lineWidth;
		data.lineStyle = lineOptions.lineStyle;
		data.externalId = this._priceLine.options().id;
	}
}
