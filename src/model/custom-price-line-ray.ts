import { merge } from '../helpers/strict-type-checks';
import { LineStyle, LineWidth } from '../renderers/draw-line';
import { CustomPriceLineRayPaneView } from '../views/pane/custom-price-line-ray-pane-view';

import { IPaneView } from '../views/pane/ipane-view';
import { PanePriceAxisView } from '../views/pane/pane-price-axis-view';
import { IPriceAxisView } from '../views/price-axis/iprice-axis-view';

import { Coordinate } from './coordinate';

import { ISeries } from './series';
import { SeriesType } from './series-options';
import { InternalHorzScaleItem } from './ihorz-scale-behavior';
import { CustomPriceLineRayPriceAxisView } from '../views/price-axis/custom-price-line-ray-price-axis-view';

export interface PriceLineRayOptions {
	id?: string;
	price: number;
	fromTime: InternalHorzScaleItem;
	toTime?: InternalHorzScaleItem;
	color: string;
	lineWidth: LineWidth;
	lineStyle: LineStyle;
	lineVisible: boolean;
	axisLabelVisible: boolean;
	title: string;
	axisLabelColor: string;
	axisLabelTextColor: string;
}

export type CreatePriceLineRayOptions = Partial<PriceLineRayOptions>;

export class CustomPriceLineRay {
	private readonly _series: ISeries<SeriesType>;
	private readonly _priceLineView: CustomPriceLineRayPaneView;
	private readonly _priceAxisView: CustomPriceLineRayPriceAxisView;
	private readonly _panePriceAxisView: PanePriceAxisView;
	private readonly _options: PriceLineRayOptions;

	public constructor(series: ISeries<SeriesType>, options: PriceLineRayOptions) {
		this._series = series;
		this._options = options;
		this._priceLineView = new CustomPriceLineRayPaneView(series, this);
		this._priceAxisView = new CustomPriceLineRayPriceAxisView(series, this);
		this._panePriceAxisView = new PanePriceAxisView(this._priceAxisView, series, series.model());
	}

	public applyOptions(options: Partial<PriceLineRayOptions>): void {
		merge(this._options, options);
		this.update();
		this._series.model().lightUpdate();
	}

	public options(): PriceLineRayOptions {
		return this._options;
	}

	public paneView(): IPaneView {
		return this._priceLineView;
	}

	public labelPaneView(): IPaneView {
		return this._panePriceAxisView;
	}

	public priceAxisView(): IPriceAxisView {
		return this._priceAxisView;
	}

	public update(): void {
		this._priceLineView.update();
		this._priceAxisView.update();
	}

	public yCoord(): Coordinate | null {
		const series = this._series;
		const priceScale = series.priceScale();
		const timeScale = series.model().timeScale();

		if (timeScale.isEmpty() || priceScale.isEmpty()) {
			return null;
		}

		const firstValue = series.firstValue();
		if (firstValue === null) {
			return null;
		}

		return priceScale.priceToCoordinate(this._options.price, firstValue.value);
	}

	public x0Coord(): Coordinate | null {
		const series = this._series;
		const priceScale = series.priceScale();
		const timeScale = series.model().timeScale();

		if (timeScale.isEmpty() || priceScale.isEmpty()) {
			return null;
		}

		const timeRange = timeScale.visibleStrictRange();
		const fromTime = this._options.fromTime;
		let timeIndex = timeScale.timeToIndex(fromTime, true);

		if (timeRange && (timeIndex === null || timeRange.left() > timeIndex)) {
			timeIndex = timeRange.left();
		}

		if (timeIndex === null) {
			return null;
		}

		return timeScale.indexToCoordinate(timeIndex);
	}

	public x1Coord(): Coordinate | null {
		const series = this._series;
		const priceScale = series.priceScale();
		const timeScale = series.model().timeScale();

		if (timeScale.isEmpty() || priceScale.isEmpty()) {
			return null;
		}

		const timeRange = timeScale.visibleStrictRange();
		const toTime = this._options.toTime;

		if (toTime == null) {
			return null;
		}

		let timeIndex = timeScale.timeToIndex(toTime, true);

		if (timeRange && (timeIndex === null || timeRange.right() < timeIndex)) {
			timeIndex = timeRange.right();
		}

		if (timeIndex === null) {
			return null;
		}

		return timeScale.indexToCoordinate(timeIndex);
	}
}
