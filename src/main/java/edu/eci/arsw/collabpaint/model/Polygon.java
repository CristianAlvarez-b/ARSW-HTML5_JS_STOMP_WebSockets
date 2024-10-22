package edu.eci.arsw.collabpaint.model;

import java.util.ArrayList;

public class Polygon {
    private ArrayList<Point> points;

    public Polygon(ArrayList<Point> points) {
        this.points = points;
    }

    public ArrayList<Point> getPoints() {
        return points;
    }

    public void setPoints(ArrayList<Point> points) {
        this.points = points;
    }
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("Polygon with points: ");
        for (Point point : points) {
            sb.append(point.toString()).append(" ");
        }
        return sb.toString().trim();
    }
}
