// import { convertTime } from '../api/data-layer';

import { merge } from '../helpers/strict-type-checks';

import { CustomRectangleView } from '../views/pane/custom-rectangle-pane-view';
import { IPaneView } from '../views/pane/ipane-view';

import { Coordinate } from './coordinate';
import { InternalHorzScaleItem } from './ihorz-scale-behavior';
import { ISeries } from './series';
import { SeriesType } from './series-options';

export interface RectangleOptions {
	id?: string;
	fillColor: string;
	borderColor: string;
	fromPrice: number;
	toPrice: number;
	fromTime: InternalHorzScaleItem;
	toTime: InternalHorzScaleItem;
}

export type CreateRectangleOptions = Partial<RectangleOptions>;

export class CustomRectangle {
	private readonly _series: ISeries<SeriesType>;
	private readonly _rectangleView: CustomRectangleView;
	private readonly _options: RectangleOptions;

	public constructor(series: ISeries<SeriesType>, options: RectangleOptions) {
		this._series = series;
		this._options = options;
		this._rectangleView = new CustomRectangleView(series, this);
	}

	public applyOptions(options: Partial<RectangleOptions>): void {
		merge(this._options, options);
		// this.update();
		this._series.model().lightUpdate();
	}

	public options(): RectangleOptions {
		return this._options;
	}

	public paneView(): IPaneView {
		return this._rectangleView;
	}

	public update(): void {
		this._rectangleView.update();
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

	public y0Coord(): Coordinate | null {
		const series = this._series;
		const priceScale = series.priceScale();
		const timeScale = series.model().timeScale();

		if (timeScale.isEmpty() || priceScale.isEmpty()) {
			return null;
		}


		const firstValue = series.firstValue();
		const priceRange = priceScale.priceRange();

		if (firstValue === null || priceRange === null) {
			return null;
		}

		let fromPrice = this._options.fromPrice;

		// if (priceRange.minValue() > fromPrice) {
		// 	fromPrice = priceRange.minValue();
		// }

		return priceScale.priceToCoordinate(fromPrice, firstValue.value);
	}

	public x1Coord(): Coordinate | null {
		const series = this._series;
		const priceScale = series.priceScale();
		const timeScale = series.model().timeScale();

		if (timeScale.isEmpty() || priceScale.isEmpty()) {
			return null;
		}

		const timeRange = timeScale.visibleStrictRange();

		if (!timeRange) {
			return null;
		}

		const right = timeRange.right();
		const toTime = this._options.toTime;
		let timeIndex = timeScale.timeToIndex(toTime, true);

		if (timeIndex === null || right < timeIndex) {
			timeIndex = right;
		}

		return timeScale.indexToCoordinate(timeIndex);
	}

	public y1Coord(): Coordinate | null {
		const series = this._series;
		const priceScale = series.priceScale();
		const timeScale = series.model().timeScale();

		if (timeScale.isEmpty() || priceScale.isEmpty()) {
			return null;
		}

		const firstValue = series.firstValue();
		const priceRange = priceScale.priceRange();

		if (firstValue === null || priceRange === null) {
			return null;
		}

		let toPrice = this._options.toPrice;

		// if (priceRange.maxValue() < toPrice) {
		// 	toPrice = priceRange.maxValue();
		// }

		return priceScale.priceToCoordinate(toPrice, firstValue.value);
	}
}
