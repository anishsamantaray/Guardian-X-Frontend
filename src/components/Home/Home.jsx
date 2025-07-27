'use client';
import AppBar       from '@/components/Layout/AppBar';
import DistanceCard from '@/components/Map/DistanceCard';
import SOSButton    from '@/components/Home/Sos';
import ActionCard   from '@/components/Home/ActionCard';
import QuickActions from "@/components/Home/QuickActions";
 import ChatbotButton from '@/components/Home/ChatbotButton';
import {useState} from "react";
export default function Home() {
    const [showChat, setShowChat] = useState(false);
  return (
      <main className="bg-gray-100 min-h-screen">
          <AppBar type="home" className="bg-transparent shadow-none text-white"/>

          {/* Distance + SOS */}
          <div className="mt-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center space-y-8">
              <DistanceCard className="w-full max-w-md bg-gray-50 text-white"/>
              <SOSButton/>
          </div>

          {/* Quick Actions */}
          <section className="mt-12 px-4 sm:px-6 lg:px-8">
              <div className="flex w-full gap-4">
                  {/* Allies */}
                  <div className="flex-1">
                      <ActionCard
                          className="w-full h-40"
                          icon="/allies1.png"
                          title="Allies"
                          description="Connect with trusted contacts"
                          path="/allies"
                      />
                  </div>

                  {/* Report Incident */}
                  <div className="flex-1">
                      <ActionCard
                          className="w-full h-40"
                          icon="/flag_transparent.png"
                          title="Report Incident"
                          description="Report safety concerns"
                          path="/report-incident"
                      />
                  </div>
              </div>
          </section>
          <QuickActions />
              <ChatbotButton onClick={() => setShowChat(prev => !prev)} />{showChat && (
    <ChatWindow onClose={() => setShowChat(false)} />
    )}
      </main>
  );
}