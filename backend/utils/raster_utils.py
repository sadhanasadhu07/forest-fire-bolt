import rasterio

def load_raster(path):
    with rasterio.open(path) as src:
        return {
            "width": src.width,
            "height": src.height,
            "crs": str(src.crs)
        }