package edu.eci.arsw.collabpaint.repository;

import edu.eci.arsw.collabpaint.model.Point;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;
@Repository
public class CollabPaintRepository {
    private ConcurrentHashMap<Integer, ArrayList<Point>> polygons;

    public CollabPaintRepository() {
        this.polygons = new ConcurrentHashMap<>();
    }

    public ArrayList<Point> getPoints(Integer key) {
        return polygons.get(key);
    }

    public ArrayList<Point> addPoint(Integer key, Point point) {
        ArrayList<Point> points = polygons.computeIfAbsent(key, k -> new ArrayList<>());
        synchronized (points) {
            points.add(point);
        }
        return new ArrayList<>(points);
    }

    public void clearArray(Integer key) {
        polygons.computeIfPresent(key, (k, v) -> {
            v.clear();
            return v;
        });
    }
}
