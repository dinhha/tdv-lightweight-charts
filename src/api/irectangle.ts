import { RectangleOptions } from '../model/custom-rectangle';

/**
 * Represents the interface for interacting with price lines.
 */
export interface IRectangle {
	/**
	 * Apply options to the price line.
	 *
	 * @param options - Any subset of options.
	 * @example
	 * ```js
	 * priceLine.applyOptions({
	 *     price: 90.0,
	 *     color: 'red',
	 *     lineWidth: 3,
	 *     lineStyle: LightweightCharts.LineStyle.Dashed,
	 *     axisLabelVisible: false,
	 *     title: 'P/L 600',
	 * });
	 * ```
	 */
	applyOptions(options: Partial<RectangleOptions>): void;
	/**
	 * Get the currently applied options.
	 */
	options(): Readonly<RectangleOptions>;
}
