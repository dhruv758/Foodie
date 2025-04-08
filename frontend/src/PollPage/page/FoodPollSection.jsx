import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

export default function FoodOrderTrackingPage() {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-6 w-full">
      {/* Schedule Card */}
      <Card className="flex-1 border-0 bg-amber-100">
        <CardHeader className="pb-2 h-16 flex items-center">
          <div className="flex justify-between items-center w-full">
            <CardTitle className="text-amber-800 text-2xl font-medium">Schedule</CardTitle>
            <div className="text-right">
              <div className="font-medium">21 March 2025</div>
              <div className="flex items-center justify-end mt-1">
                <Clock className="h-4 w-4 mr-1" />
                <span>14:00</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-white rounded-lg p-4 mb-4">
            <h3 className="text-xl mb-6">What you want to eat today?</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex justify-between items-center rounded-full border-1">
                <span className="text-teal-600">Chinese</span>
                <span className="text-gray-500 ml-2">9</span>
              </Button>
              <Button variant="outline" className="flex justify-between items-center rounded-full border-1">
                <span className="text-teal-600">Burger</span>
                <span className="text-gray-500 ml-2">15</span>
              </Button>
              <Button variant="outline" className="flex justify-between items-center rounded-full border-1">
                <span className="text-teal-600">Veg Thali</span>
                <span className="text-gray-500 ml-2">8</span>
              </Button>
              <Button variant="outline" className="flex justify-between items-center rounded-full border-1">
                <span className="text-teal-600">Pizza</span>
                <span className="text-gray-500 ml-2">10</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* In Progress Card */}
      <Card className="flex-1 border-0 bg-green-100">
        <CardHeader className="pb-2 h-16 flex items-center">
          <div className="flex justify-between items-center w-full">
            <CardTitle className="text-green-800 text-2xl font-medium">In Progress</CardTitle>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>1:06:30</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-white rounded-lg p-4 mb-4">
            <h3 className="text-xl mb-6">What you want to eat today?</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex justify-between items-center rounded-full border-1">
                <span className="text-teal-600">Chinese</span>
                <span className="text-gray-500 ml-2">9</span>
              </Button>
              <Button variant="outline" className="flex justify-between items-center rounded-full border-1">
                <span className="text-teal-600">Burger</span>
                <span className="text-gray-500 ml-2">15</span>
              </Button>
              <Button variant="outline" className="flex justify-between items-center rounded-full border-1">
                <span className="text-teal-600">Veg Thali</span>
                <span className="text-gray-500 ml-2">8</span>
              </Button>
              <Button variant="outline" className="flex justify-between items-center rounded-full border-1">
                <span className="text-teal-600">Pizza</span>
                <span className="text-gray-500 ml-2">10</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Done Card */}
      <Card className="flex-1 border-0 bg-red-100">
        <CardHeader className="pb-2 h-16 flex items-center">
          <div className="flex justify-between items-center w-full">
            <CardTitle className="text-red-600 text-2xl font-medium">Done</CardTitle>
            <div className="opacity-0">
              <Clock className="h-4 w-4 mr-1 inline" />
              <span>Placeholder</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-white rounded-lg p-4 mb-4">
            <h3 className="text-xl mb-6">Your food is prepared.</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex justify-between items-center rounded-full border-1">
                <span className="text-teal-600">Chinese</span>
                <span className="text-gray-500 ml-2">9</span>
              </Button>
              <Button variant="outline" className="flex justify-between items-center rounded-full border-1">
                <span className="text-teal-600">Burger</span>
                <span className="text-gray-500 ml-2">15</span>
              </Button>
              <Button variant="outline" className="flex justify-between items-center rounded-full border-1">
                <span className="text-teal-600">Veg Thali</span>
                <span className="text-gray-500 ml-2">8</span>
              </Button>
              <Button variant="outline" className="flex justify-between items-center rounded-full border-1">
                <span className="text-teal-600">Pizza</span>
                <span className="text-gray-500 ml-2">10</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}